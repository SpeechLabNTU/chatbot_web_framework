import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer 
import random
import numpy as np
from tensorflow.python.framework import ops
import tflearn
import logging, os
import warnings  
import pickle
import math
import matplotlib.pyplot as plt

def serialize_input(matrix,num_column,num_rows):
    L2sum_store = {}
    for x in range(num_rows):
        L2sum = 0
        for y in range(num_column):
            L2sum = L2sum + (matrix[x][y] ** 2)
        L2sum_store[x] = math.sqrt(L2sum)
    
    for x in range(num_rows):
        total_term_frequency = sum(matrix[x])
        for y in range(num_column):
            matrix[x][y] = (matrix[x][y]/total_term_frequency) * L2sum_store[x]
            
    return matrix

stemmer = PorterStemmer()
with open('../dataConstruction/babybonusintents.json') as json_data:
    intents = json.loads(json_data.read())

words = []
classes = []
documents = []
ignore_words = ['?']

for intent in intents['intents']:
    for question in intent['patterns']:
        w = nltk.word_tokenize(question)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])


#Stem words and remove duplicates
words = [stemmer.stem(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))


# print(len(classes),"classes",classes)
# print(len(words),"Unique words",words)

#creating training data
training = []
output = []

#initialize empty array for output
output_empty = [0] * len(classes)

#training set, bag of words for each sentence
for doc in documents:
    bag = []
    words_in_questions = doc[0]
    words_in_questions = [stemmer.stem(word.lower()) for word in words_in_questions]
    for w in words:
        bag.append(1) if w in words_in_questions else bag.append(0)
    
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1

    training.append([bag,output_row])

#Shuffle and convert training data to numpy array  
random.shuffle(training)
training = np.array(training)

#Split train and test data
train_x = list(training[:,0])
train_y = list(training[:,1])

num_rows_x, num_columns_x = (np.array(train_x)).shape
num_rows_y, num_columns_y = (np.array(train_y)).shape

train_x = serialize_input(train_x,num_columns_x,num_rows_x)
train_y = serialize_input(train_y,num_columns_y,num_rows_y)

# print(num_rows_x)
# print(num_columns_x)

# print(num_rows_y)
# print(num_columns_y)

#Build model

#Reset graph data
ops.reset_default_graph()

# #Build Neural Network
net = tflearn.input_data(shape=[None, len(train_x[0])])
net = tflearn.fully_connected(net, 12)
net = tflearn.fully_connected(net, 12)
net = tflearn.fully_connected(net, len(train_y[0]),activation='softmax')
net = tflearn.regression(net)

# #Model definition 
model = tflearn.DNN(net, tensorboard_dir='tflearn_logs')

#Train Model
model.fit(train_x, train_y, n_epoch=50, batch_size=32, show_metric=True, validation_set=0.2, shuffle=True)


# model.save('model.tflearn')

# pickle.dump({'words':words, 'classes':classes, 'train_x':train_x, 'train_y':train_y}, open("training_data","wb"))