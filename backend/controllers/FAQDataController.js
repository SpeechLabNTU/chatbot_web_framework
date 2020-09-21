const axios = require('axios')
const fs = require('fs')
const csvReader = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

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
  static async getFAQData(req, res, next) {
    var topic = req.params.topic
    var file = topicToFileMapping[topic]
    var results = []

    fs.createReadStream(`./data/${file}`)
    .pipe(csvReader(['Index', 'Question', 'Answer']))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // console.log(results)
      res.json({data: results})
    })
  }

  static async writeFAQData(req, res, next) {
    var topic = req.body.topic
    var file = topicToFileMapping[topic] || `${topic}.csv`

    const csvWriter = createCsvWriter({
      path: `./data/${file}`,
      header: [ "Index", "Question", "Answer"]
    })
    csvWriter.writeRecords(req.body.data)
    .then( () => {
      console.log(`${file} has been updated.`)
    })
    res.send(`${file} has been updated.`)
  }

  static async getFAQTopics(req, res, next) {
    res.json({topics: Object.keys(topicToFileMapping)})
  }

  static async processCSV(req, res, next) {
    var file = req.file
    var results = []

    fs.createReadStream(file.path)
    .pipe(csvReader(["Index", "Question", "Answer"]))
    .on('data', (data) => results.push(data))
    .on('end', () => {
      if (fs.existsSync(file.path)) { // clean original file after converting
          fs.unlinkSync(file.path)
      }
      res.json({data: results})
    })
  }
}

module.exports = FAQDataController
