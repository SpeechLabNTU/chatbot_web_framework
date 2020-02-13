const express = require('express')
const router = express.Router()
const request = require('request')

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

module.exports = router