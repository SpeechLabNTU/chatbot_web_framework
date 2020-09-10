const axios = require('axios')
const fs = require('fs')
const csv = require('csv-parser')

const topicToFileMappingFile = "./data/master_record_datafiles.json"
var topicToFileMapping = {}

fs.readFile(topicToFileMappingFile, (err, data) => {
  if (err) {
    console.log("MASTER RECORD DATAFILE NOT FOUND.")
  }
  else {
    topicToFileMapping = JSON.parse(data.toString())
    // console.log("Master record datafile loaded.")
  }
})


class FAQDataController {
  static async getQuestionData(req, res, next) {
    var topic = req.body.topic
    var file = topicToFileMapping[topic]
    var results = []

    fs.createReadStream(`./data/${file}`)
    .pipe(csv(['Index', 'Question', 'Answer']))
    .on('data', (data) => results.push(data))
    .on('end', () =>  {
      console.log(results)
      res.json({data:results})
    })

  }
}

module.exports = FAQDataController
