const express = require('express')
const router = express.Router()
const request = require('request')

router.post("/api/queryEndpoint", (req, res) => {
    
    let queryText = req.body.question

    request({
        method:'POST',
        url: "http://13.76.152.232:1995/ask",
        json: {"question":queryText}
    }, (error, response, body) =>{ 

        if(error !== null){
            if (error.errno === "ECONNREFUSED"){
                res.json({ reply: "Lab server is down", queries:[]})
            }
        }else{
            res.json({ reply: response.body.result})
        }
    });


});

module.exports = router