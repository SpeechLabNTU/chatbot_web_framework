const express = require('express')
const router = express.Router()
const axios = require('axios')
const dotenv = require('dotenv');
dotenv.config();

/*Deep Neural Network Python API*/
router.post("/api/russ_query", (req, res) => {

    let query = req.body.question

    axios.post(`${process.env.FLASK_ENDPOINT}/api/query`, {
      request: query,
    })
    .then( response => {
      res.json({ reply: response.data.response, queries: response.data.reccomendation})
    })
    .catch( error => {
      res.json({ reply: "DNN server is down" })
    })

});

/*Response Comparison*/
router.post("/api/responseCompare", (req,res)=>{

    let query = req.body.responses
    // console.log(query)

    axios.post(`${process.env.FLASK_ENDPOINT}/api/similarityCheck`, {
      request: query,
    })
    .then( response => {
      // console.log(query)
      // console.log(response.data.response)
      res.status(200).json({ reply: response.data.response })
    })
    .catch( error => {
      res.json({ reply:-1 })
    })

});

module.exports = router
