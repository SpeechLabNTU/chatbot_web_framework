const express = require('express')
const router = express.Router()
const request = require('request')

router.post("/api/queryEndpoint", (req, res) => {
    
    let queryText = req.body.question
    
    const options = {
        method: "POST",
        url: "http://13.76.152.232:1995/ask",
        headers: {
            "Authorization": "Basic ",
            "Content-Type": "multipart/form-data"
        },
        formData : {
            "question" : queryText
        }
    };

    request(options, function (error, response, body){
        if(error !== null){
            if (error.errno === "ECONNREFUSED"){
                res.json({ reply: "Server is down", queries:[]})
            }
        }else{
            responseQueryText = JSON.parse(response.body)
            res.json({reply: responseQueryText})
        }
    })

});

module.exports = router