# Installation

Flask Service is used as a REST API for the response comparison service

To get started you would require Python 3 installed on your system

*Note*
Remove TFlearn and tensorflow dependencies in the requirements file if you do not intent to run the text classification model

Run: `pip3 install -r requirements.txt` to install the python dependencies

# Starting up comparison service

Run: `python flaskApp/flaskApp.py` to start up Flask API

# Preprocessing of data (Optional)

Run: `python dataConstruction/constructIntent.py` for construction of json object for training (Request permutation file from Admin)

# Training/writing text classification model (Optional)

Run: `python dnnTraining/intentMatching.py` for training of text classification model