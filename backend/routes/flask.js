const express = require('express')
const router = express.Router()
const request = require('request')
const dotenv = require('dotenv');
dotenv.config();

/*Deep Neural Network Python API*/
router.post("/api/russ_query", (req, res) => {

    let query = req.body.question

    request({
        method:'POST',
        url: `${process.env.FLASK_ENDPOINT}/api/query`,
        json: {"request":query}
    }, (error, response, body) =>{

        if(error !== null){
            if (error.errno === "ECONNREFUSED"){
                res.json({ reply: "DNN server is down", queries:[]})
            }
        }else{
            res.json({ reply: response.body.response, queries: response.body.reccomendation})
        }
    });

});

/*Response Comparison*/
router.post("/api/responseCompare", (req,res)=>{

    let query = req.body.responses
    // console.log(query)

    request({
        method:'POST',
        url: `${process.env.FLASK_ENDPOINT}/api/similarityCheck`,
        json: {"request":query}
    }, (error, response, body) =>{
        if (error !== null){
            if(error.errno === "ECONNREFUSED"){
                res.json({ reply:-1})
            }
        }else{
            console.log(query)
            console.log(response.body.response)
            res.status(200).json({ reply: response.body.response})
        }
    });

});

module.exports = router
