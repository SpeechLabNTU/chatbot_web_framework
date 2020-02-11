import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer 
import random
import numpy as np
import logging, os
import warnings  
import pickle

stemmer = PorterStemmer()
with open('babybonusintents.json') as json_data:
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

#Build model

#Reset graph data
ops.reset_default_graph()

#Build keras Neural Network
from keras.models import Sequential
from keras.layers import Dense
#create model
model = Sequential()

#add model layers
model.add(Dense(10, activation='relu', input_shape=(len(train_x[0]),)))
model.add(Dense(10, activation='relu'))
model.add(Dense(1))

#compile model using mse as a measure of model performance
model.compile(optimizer='adam', loss='mean_squared_error')

from keras.callbacks import EarlyStopping
#set early stopping monitor so the model stops training when it won't improve anymore
early_stopping_monitor = EarlyStopping(patience=3)
#train model
model.fit(train_X[0], train_y[0], validation_split=0.2, epochs=30, callbacks=[early_stopping_monitor])

model.save('model.tflearn')

pickle.dump({'words':words, 'classes':classes, 'train_x':train_x, 'train_y':train_y}, open("training_data","wb"))