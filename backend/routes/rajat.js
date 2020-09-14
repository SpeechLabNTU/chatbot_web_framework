const express = require('express')
const router = express.Router()
const request = require('request')
const dotenv = require('dotenv')
dotenv.config()

router.post("/api/queryEndpoint", (req, res) => {

    let queryText = req.body.question
    let topic = req.body.topic

    let apiEndpoint = ''
    switch (topic){
      case 'Baby Bonus':
        apiEndpoint = process.env.RAJAT_ENDPOINT_BABYBONUS
        break
      case 'Covid 19':
        apiEndpoint = process.env.RAJAT_ENDPOINT_COVID19
        break
      default:
        break
    }

    request({
      method:'POST',
      url: `${apiEndpoint}/ask`,
      json: {"question": queryText}
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
