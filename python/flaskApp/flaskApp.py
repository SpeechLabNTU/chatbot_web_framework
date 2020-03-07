from flask import Flask, request, jsonify
app = Flask(__name__)
from matchTest import *
from cosineSimilarity import *

DNNmodel = predict()
Similarity = measure()

@app.route('/api/query', methods=['GET','POST'])
def query():
    with open('../dataConstruction/babybonusintents.json') as json_data:
            intents = json.loads(json_data.read())
    content = request.json
    question = content['request']
    tagged_questions = DNNmodel.classify(question)
    reply = ""
    
    if len(tagged_questions) == 0:
        reply = "Query not specific enough"
    else:
        query = ""
        reccommendation = []
        
        for ques in tagged_questions:
            json_obj = {"question":ques[0],"score": str(ques[1])}
            reccommendation.append(json_obj)

        for q in tagged_questions:
            query = q[0]
            break

        for row in intents['intents']:
            if (str(row['tag']) == str(query) ):
                reply = row['response']
        
    return jsonify({"response":reply, "reccomendation":reccommendation})

@app.route('/api/similarityCheck', methods=['GET','POST'])
def similarityCheck():
    content2 = request.json
    similarity_threshold = Similarity.Similarity(content2['request'])

    return jsonify({"response":similarity_threshold})


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)