def Similarity(self, sentence_pair):
        sentence1 = sentence_pair[0]
        sentence2 = sentence_pair[1]

        #Tokenize each sentence
        S1 = word_tokenize(sentence1)
        S2 = word_tokenize(sentence2)

        #Initialize stopword and vector
        V1 = []
        V2 = []

        #Remove stopwords
        S1 = {w for w in S1 if not w in self.sw}
        S2 = {w for w in S2 if not w in self.sw}

        #Form bag of words and populate individual sentence vector
        bow_vector = S1.union(S2)
        for w in bow_vector:
            if w in S1: V1.append(1)
            else: V1.append(0)

            if w in S2: V2.append(1)
            else: V2.append(0)

        #Calculate cosine similarity
        c = 0
        for i in range(len(bow_vector)):
            c += V1[i] * V2[i]
        
        cosineSimilarity = c / float((sum(V1)*sum(V2))**0.5)

        return round(cosineSimilarity,2)