const express = require('express')
const router = express.Router()
const fs = require('fs');

router.post("/api/askJamieFast", (req,res)=> {
    let query = req.body.question
    example(query,res)
    
});

function example(query,res){

    fs.writeFile("questions.txt", query, function(err) {
        if(err) {
            return console.log(err);
        }
    })

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['ask_jamie.py','--test_questions', 'questions.txt']);

    pyProg.stdout.on('data', function(data) {

        res.json({reply: data.toString()});
    });
}

module.exports = router