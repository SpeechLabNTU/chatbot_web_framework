const express = require('express')
const router = express.Router()
const request = require('request')
const dotenv = require('dotenv');
dotenv.config();

router.post("/api/queryEndpoint", (req, res) => {
    
    let queryText = req.body.question

    request({
        method:'POST',
        url: `${process.env.RAJAT_ENDPOINT}/ask`,
        json: {"question":queryText}
    }, (error, response) =>{ 

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