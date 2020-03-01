const express = require('express')
const router = express.Router()
const request = require('request')

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb/baby_bonus_faq_service]*/
router.post("/api/directQuery", (req, res) => {
    
    // let queryText = req.body.queryResult.queryText
    let queryText = req.body.question
    
    const options = {
        method: "POST",
        url: "http://13.76.152.232:8081/ask_bb/baby_bonus_faq_service",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "multipart/form-data"
        },
        formData : {
            "input" : queryText
        }
    };

    request(options, function (error, response, body){
        if(error !== null){
            if (error.errno === "ECONNREFUSED"){
                res.json({ reply: "MICL server is down", queries:[]})
            }
        }else{
            responseQueryText = JSON.parse(response.body)
            // var sendBack = {fulfillmentMessages: [{"text":{"text": [responseQueryText.top1]}}]}
            res.json({reply: responseQueryText.top1})
        }
    })

});

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb_rephrased/baby_bonus_faq_service]*/
router.post("/api/directQueryRephrased", (req, res) => {
    
    let query = req.body.question
    
    const options = {
        method: "POST",
        url: "http://13.76.152.232:8081/ask_bb_rephrased/baby_bonus_faq_service",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "multipart/form-data"
        },
        formData : {
            "input" : query
        }
    };

    request(options, function (error, response, body){
        if(error !== null){
            if (error.errno === "ECONNREFUSED"){
                res.json({ reply: "MICL server is down", queries:[]})
            }
        }else{
            responseQueryText = JSON.parse(response.body)
            // console.log(responseQueryText.top1)
            res.json({ reply: responseQueryText.top1})
        }
    })

});

/*Andrew QA Matching API [http://155.69.146.213:8081/ask_bb_bp/baby_bonus_faq_service]*/
router.post("/api/directQueryBp", (req, res) => {
    
    let query = req.body.question
    
    const options = {
        method: "POST",
        url: "http://13.76.152.232:8081/ask_bb_bp/baby_bonus_faq_service",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "multipart/form-data"
        },
        formData : {
            "input" : query
        }
    };

    request(options, function (error, response, body){
        if(error !== null){
            if (error.errno === "ECONNREFUSED"){
                res.json({ reply: "MICL server is down", queries:[]})
            }
        }else{
            responseQueryText = JSON.parse(response.body)
            // console.log(responseQueryText.top1)
            res.json({ reply: responseQueryText.top1})
        }
        
    })

});

module.exports = router