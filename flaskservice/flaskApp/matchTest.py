import pickle
import json
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer 
import numpy as np
import logging, os
import warnings  

with warnings.catch_warnings():  
    warnings.filterwarnings("ignore",category=FutureWarning)
    import tflearn

logging.getLogger('tensorflow').disabled = True

class predict(object):

    def __init__(self):
        self.stemmer = PorterStemmer()
        self.ERROR_THRESHOLD = 0.25
        self.data = pickle.load(open ("../dnnTraining/training_data","rb"))
        self.words = self.data['words']
        self.classes = self.data['classes']
        self.train_x = self.data['train_x']
        self.train_y = self.data['train_y']

        #Build Neural Network
        self.net = tflearn.input_data(shape=[None, len(self.train_x[0])])
        self.net = tflearn.fully_connected(self.net, 12)
        self.net = tflearn.fully_connected(self.net, 12)
        self.net = tflearn.fully_connected(self.net, len(self.train_y[0]),activation='softmax')
        self.net = tflearn.regression(self.net)

        #Model definition 
        self.model = tflearn.DNN(self.net, tensorboard_dir='tflearn_logs')

        self.model.load('./../dnnTraining/model.tflearn')

    def clean_sentence(self, sentence):
        sentence_words = nltk.word_tokenize(sentence)
        sentence_words = [self.stemmer.stem(w.lower()) for w in sentence_words]
        return sentence_words

    def bag_of_words(self, sentence, words, show_details=False):
        cleaned_sentence = self.clean_sentence(sentence)
        bag = [0]*len(words)
        for s in cleaned_sentence:
            for i,w in enumerate(words):
                if w==s:
                    bag[i] = 1
                    if show_details:
                        print("found in bag: %s" %w)
        
        return(np.array(bag))


    def classify(self, sentence):
        #generate probability from model
        results = self.model.predict([self.bag_of_words(sentence,self.words)])[0]

        #filter out predictions below the threshold
        results = [[i,r] for i,r in enumerate(results) if r> self.ERROR_THRESHOLD]

        #sort by probability
        results.sort(key=lambda x: x[1], reverse=True)
        return_list = []

        for r in results:
            return_list.append((self.classes[r[0]], r[1]))

        return return_list
