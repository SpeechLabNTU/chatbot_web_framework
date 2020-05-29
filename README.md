# Final Year Project FAQ Chatbot Framework for Response Comparisons and Performance Analysis

# Project Summary
The objective of this project is to design a full stack web application to compare a variable set of FAQ Chatbot API endpoints. The chatbot platform includes a text input and a speech input for intuitiveness and to cater for real live scenarios. For the context of this project, MSF's Baby Bonus is used as a test bed for FAQ question and answer matching.<br/>

# FAQ Matching APIs
1. Govtech's askJamie (Benchmark for accuracy comparison)<br/>
2. MICL lab's QA Matching Model<br/>
3. Google's Dialogflow<br/>
4. Text Classification Model<br/>
5. Rajat QA Matching Model<br/>

# Speech to Text API
1. AISG's Speech to Text<br/>
2. Google's Speech API<br/>
3. Twilio Speech Lab (To be implemented)<br/>

# Features
1. Text and Speech based input methods<br/>
2. Multi FAQ Endpoint selection for response visualization<br/>
3. Response similarity comparison<br/>
4. Recommendation for similar questions<br/>

# Deployment Considerations
Docker is used to set up 3 microservices React Frontend, Node Backend and Flask Server for response comparison. A docker-compose file is used to start up all microservices for deployment usage. Docker deployment resources can be found in the Docker branch of the repository.

# Includes:
**frontend directory**: Written on ReactJS, provides the view of the application<br/>
**backend directory**: Written on NodeJS, provides API endpoints for frontend<br/>
**comparison directory**: Written on Flask, provides API service for response comparisons<br/>
**dialogflowfunctions**: Written on NodeJS, used to upload intentions to dialogflow for NLP training<br/>
**flaskservice directory**: Written on Flask, provides Text Classification Model Training and response comparisons<br/>

# Master Branch

**Running Development**<br/>
Following directories must be executed in seperate terminals to run application

1. Frontend Directory<br/>
2. Backend Directory<br/>
3. flaskservice Directory(Deep Neural Network + Similarity) or comparison Directory(Similarity only)<br/>

**Additional Requirement**<br/>
Create a (.env) file in the Backend Directory with the following:<br/>

DIALOGFLOW_PROJECT_ID= XXX<br/>
AISG_TOKEN= XXX<br/>
SPEECH_API= ws://40.90.170.182:8001/client/ws/speech<br/>
SPEECH_HTTP_API= http://40.90.170.182:8001/client/dynamic/recognize <br/>

# Installation/setup instructions will be provided in each directory.