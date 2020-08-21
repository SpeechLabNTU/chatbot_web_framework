from flask import Flask, request, jsonify
from cosineSimilarity import *
import os

app = Flask(__name__)

Similarity = measure()


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'success'})


@app.route('/api/similarityCheck', methods=['GET', 'POST'])
def similarityCheck():
    content2 = request.json
    similarity_threshold = Similarity.Similarity(content2['request'])

    return jsonify({"response": similarity_threshold})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT', 5000))
