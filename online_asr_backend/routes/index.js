const express = require('express')
const router = express.Router()
const MainController = require('../controllers/MainController')
const upload = require('../upload')
const request = require('request')

router.post('/stream/record', MainController.streamByRecording)

router.post('/stream/import', upload.single('file'), MainController.streamByImport)

router.post("/api/matching", (req, res) => {

    var keywords = req.body.queryResult.parameters
    var queryText = req.body.queryResult.queryText
    var responseKeyword;
    var responseQueryText;
    var queryFormation="";

    var lengthOfKeywords  = Object.keys(keywords).length;
    var count = 0

    Object.keys(keywords).forEach(function(key) {
        if(keywords[key] !== ""){
            count = count + 1
        }
    })

    if(count != lengthOfKeywords){
        console.log("Keyword parameters not fulfilled")

        const options = {
            method: "POST",
            url: "http://155.69.146.213:5001/ask_bb/baby_bonus_faq_service",
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

        
    }else{
        Object.keys(keywords).forEach(function(key) {
            queryFormation = queryFormation + keywords[key] + " "
        })
        console.log(queryFormation)
        console.log("Keywords fulfilled.")
        const options = {
            method: "POST",
            url: "http://155.69.146.213:5001/ask_bb/baby_bonus_faq_service",
            headers: {
                "Authorization": "Basic ",
                "Content-Type": "multipart/form-data"
            },
            formData : {
                "input" : queryFormation
            }
        };

        request(options, function (error, response, body){
            responseKeyword = JSON.parse(response.body)
            //console.log(responseKeyword.top1)
            var sendBack = {fulfillmentMessages: [{"text":{"text": [responseKeyword.top1]}}]}
            return res.json(sendBack)
        })
    }

});

router.post("/api/prompt", (req, res) => {

    var queryText = req.body.queryResult.queryText
    var intent = req.body.queryResult.intent.displayName
    var intentURL = req.body.queryResult.intent.name

    if (intent === "Default Fallback Intent"){
        const options = {
            method: "POST",
            url: "http://155.69.146.213:5001/ask_bb/baby_bonus_faq_service",
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
    }else{

        const options = {
            method: "GET",
            url: "https://dialogflow.googleapis.com/v2/"+intentURL+"?intentView=INTENT_VIEW_FULL",
            headers: {
                "Authorization": "Bearer ya29.c.Kl6GB6DvAdUJS8ZRiyGw31gYfxuIm71OeG37TcMiJaM5L214OC_bwkjqFWkIa0UH9lx8jh1HVxp_2v3X_KGryzrZKW0qWVTp6au1OcECxYpis_wQV7WmGxDYj1LsTKkk",
                "Content-Type": "application/json"
            }
        };

        var arrayOfQuery = []
        var queryConstruction = ""

        
        request(options, function (error, response, body){
            var intentResponse = JSON.parse(response.body)
            var alltrainingPhrases  = intentResponse.trainingPhrases
            alltrainingPhrases.forEach((element)=>{
                var trainingPhrase = element.parts
                queryConstruction = ""
                trainingPhrase.forEach(function(value){
                    queryConstruction += value.text
                });
                arrayOfQuery.push(queryConstruction)
            })
            var num = Math.floor(Math.random() * Math.floor(arrayOfQuery.length));
            console.log(arrayOfQuery[num])
            sendQuery(arrayOfQuery[num],res)

        })
    }
});

function sendQuery(query,res){

    const options = {
        method: "POST",
        url: "http://155.69.146.213:5001/ask_bb/baby_bonus_faq_service",
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
        var sendBack = {fulfillmentMessages: [{"text":{"text": [responseQueryText.top1]}}]}
        return res.json(sendBack)
    })
    
}

router.post("/api/directQuery", (req, res) => {
    
    var queryText = req.body.queryResult.queryText
    
    const options = {
        method: "POST",
        url: "http://155.69.146.213:5001/ask_bb/baby_bonus_faq_service",
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

router.post("/api/askJamie"), (req,res)=> {
    console.log(req)
    const {Builder, By, Key, until} = require('selenium-webdriver');
    var chrome = require('selenium-webdriver/chrome');
    var options = new chrome.Options().headless();
    var AskJamieReply = ""

    (async function example(){
        let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        try {
            await driver.get('https://www.babybonus.msf.gov.sg');
            await driver.findElement(By.name('chat_input')).sendKeys('baby bonus', Key.RETURN);
            await driver.wait(until.elementLocated(By.className('speech\-bubble1')),10000)
            
        } finally {
            var replyPromise = driver.findElement(By.className('last_li'))
                                        .findElement(By.className('speech\-bubble1'))
                                        .findElement(By.tagName('div')).getText();
                                        
                                    
            replyPromise.then((text)=>{
                AskJamieReply = text
                driver.quit()
            });
        }
    })();

    res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify({ reply: AskJamieReply }));
}




module.exports = router
