const express = require('express')
const router = express.Router()
const dialogflow = require('dialogflow');
const uuid = require('uuid');

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
  
    await sessionClient.detectIntent(request).then(responses=>{
      const result = responses[0].queryResult.fulfillmentMessages[0].text.text[0];
      res.json({reply: result})
    }).catch(err=>{
      res.json({reply: "Unable to reach Dialogflow"})
    })
    
}

module.exports = router