const express = require('express')
const router = express.Router()
const MainController = require('../controllers/MainController')
const upload = require('../upload')
const request = require('request')
const dialogflow = require('dialogflow');
const uuid = require('uuid');
var fs = require('fs');

router.post('/stream/record', MainController.streamByRecording)

router.post('/stream/import', upload.single('file'), MainController.streamByImport)

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb/baby_bonus_faq_service]*/

router.post("/api/directQuery", (req, res) => {
    
    let queryText = req.body.queryResult.queryText
    
    const options = {
        method: "POST",
        url: "http://155.69.146.213:8081/ask_bb/baby_bonus_faq_service",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "multipart/form-data"
        },
        formData : {
            "input" : queryText
        }
    };

    request(options, function (error, response, body){
        responseQueryText = JSON.parse(response.body)
        var sendBack = {fulfillmentMessages: [{"text":{"text": [responseQueryText.top1]}}]}
        return res.json(sendBack)
    })

});


/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb_rephrased/baby_bonus_faq_service]*/

router.post("/api/directQueryRephrased", (req, res) => {
    
    let query = req.body.question
    
    const options = {
        method: "POST",
        url: "http://155.69.146.213:8081/ask_bb_rephrased/baby_bonus_faq_service",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "multipart/form-data"
        },
        formData : {
            "input" : query
        }
    };

    request(options, function (error, response, body){
        responseQueryText = JSON.parse(response.body)
        console.log(responseQueryText.top1)
        res.json({ reply: responseQueryText.top1})
    })

});

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb_bp/baby_bonus_faq_service]*/

router.post("/api/directQueryBp", (req, res) => {
    
    let query = req.body.question
    
    const options = {
        method: "POST",
        url: "http://155.69.146.213:8081/ask_bb_bp/baby_bonus_faq_service",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "multipart/form-data"
        },
        formData : {
            "input" : query
        }
    };

    request(options, function (error, response, body){
        responseQueryText = JSON.parse(response.body)
        console.log(responseQueryText.top1)
        res.json({ reply: responseQueryText.top1})
    })

});

/*Ask Jamie Python API*/

router.post("/api/askJamieFast", (req,res)=> {
    
    let query = req.body.question
    example(query,res)
    
});

function example(query,res){

    const fs = require('fs');
    fs.writeFile("questions.txt", query, function(err) {

        if(err) {
            return console.log(err);
        }
    })

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['ask_jamie.py','--test_questions', 'questions.txt']);

    pyProg.stdout.on('data', function(data) {

        res.json({reply: data.toString()});
    });
}

/*Dialogflow Connection*/

router.post("/api/dialogflow", (req,res)=> {

    console.log(req.body.question)
    
    query = req.body.question
    dialoflowConnection(query,res)
    
});

async function dialoflowConnection(query, res) {
    
    const sessionId = uuid.v4();
    const projectId = 'chatbot-development-250810'
  
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: 'en-US',
        },
      },
    };
  
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentMessages[0].text.text[0];
    res.status(200).json({reply: result})
}

module.exports = router

/*Deep Neural Network Python API*/

router.post("/api/russ_query", (req, res) => {
    
    let query = req.body.question

    request({
        method:'POST',
        url: "http://localhost:5000/api/query",
        json: {"request":query}
    }, (error, response, body) =>{ 

        res.setTimeout(5000, function(){
            res.status(500)
        });

        if(!error){
            res.status(200).json({ reply: response.body.response, queries: response.body.reccomendation})
        }else{
            res.status(500)
        }
        
    });

});

/*Response Comparison*/

router.post("/api/responseCompare", (req,res)=>{
    
    let query = req.body.responses
    console.log(query)
    request({
        method:'POST',
        url: "http://localhost:5000/api/similarityCheck",
        json: {"request":query}
    }, (error, response, body) =>{

        if(!error){
            res.status(200).json({ reply: response.body.response})
        }else{
            res.status(500)
        }
        
    });
});