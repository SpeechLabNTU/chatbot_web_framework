import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer 
import numpy as np
import math

class measure(object):

    def __init__(self):
        self.bag_of_words = []
        self.stemmer = PorterStemmer()

    def construct_bow(self,sentence):

        w = nltk.word_tokenize(sentence)
        return w

    def serialize_input(self,matrix,num_column):

        L2sum_store = {}
        for x in range(2):
            L2sum = 0
            for y in range(num_column):
                L2sum = L2sum + (matrix[x][y] ** 2)
            L2sum_store[x] = math.sqrt(L2sum)
        
        for x in range(2):
            total_term_frequency = sum(matrix[x])
            for y in range(num_column):
                matrix[x][y] = (matrix[x][y]/total_term_frequency) * L2sum_store[x]
                
        return matrix

    def measureSimilarity(self, sentence_pair):

        print(sentence_pair)
        for sentence in sentence_pair:
            w = nltk.word_tokenize(sentence)
            self.bag_of_words.extend(w)
        
        self.bag_of_words = [self.stemmer.stem(w.lower()) for w in self.bag_of_words]
        self.bag_of_words = sorted(list(set(self.bag_of_words)))

        matrix = np.zeros((2,len(self.bag_of_words)))

        index = 0

        while index < len(sentence_pair):
            w = self.construct_bow(sentence_pair[index])
            w = [self.stemmer.stem(word.lower()) for word in w]
            w = sorted(list(set(w)))

            for item in w:
                matrix[index][self.bag_of_words.index(item)] += 1
            
            index = index + 1
        
        matrix = self.serialize_input(matrix, len(self.bag_of_words))

        i = 0 
        cosineSimilarity = 0

        while i < len(self.bag_of_words):
            cosineSimilarity = cosineSimilarity + (matrix[0][i] * matrix[1][i])
            i = i+1
        
        return cosineSimilarity








