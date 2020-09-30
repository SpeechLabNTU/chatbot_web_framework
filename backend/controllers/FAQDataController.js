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

  static addNewTopic(req, res, next) {
    var topic = req.body.topic

    if (!topic) {
      console.log("Could not add topic, no topic found in request.")
      res.send("No topic found in request.")
    }
    else {
      topicToFileMapping[topic] = `${topic}.json`

      fs.writeFile(topicToFileMappingFile, JSON.stringify(topicToFileMapping), (err) => {
        if (err) console.log(err)
        else {
          fs.writeFileSync(`./data/${topicToFileMapping[topic]}`, "[]")
          console.log(`${topic} has been added to master file and ${topic}.json was created.`)
          res.send(`Created new json file for ${topic}.`)
        }
      })
    }
  }

  static removeTopic(req, res, next) {
    var topic = req.body.topic
    var filename = topicToFileMapping[topic]
    delete topicToFileMapping[topic]

    if (!topic) {
      console.log("Could not remove topic, no topic found in request.")
      res.send("No topic found in request.")
    }
    else if (!filename) {
      console.log("Could not remove topic, could not find file related to topic.")
      res.send("No file found for topic.")
    }
    else {
      fs.writeFile(topicToFileMappingFile, JSON.stringify(topicToFileMapping), (err) => {
        if (err) console.log(err)
        else {
          fs.unlinkSync(`./data/${filename}`, "")
          console.log(`${topic} has been removed from master file and ${filename} was removed.`)
          res.send(`${topic} data and files removed.`)
        }
      })
    }
  }

  static async getFAQData(req, res, next) {
    var topic = req.params.topic
    var filename = topicToFileMapping[topic]
    var results = []

    if (!topic) {
      console.log("Could not GET faqdata, no topic found in request.")
      res.send("No topic found in request.")
    }
    else if (!filename) {
      console.log("Could not GET faqdata, could not find file related to topic.")
      res.send("No file found for topic.")
    }
    else {
      results = JSON.parse(fs.readFileSync(`./data/${filename}`))
      res.json({data: results})
    }
  }

  static async writeFAQData(req, res, next) {
    var topic = req.body.topic
    var filename = topicToFileMapping[topic]

    if (!topic) {
      console.log("Could not write faqdata, no topic found in request.")
      res.send("No topic found in request.")
    }
    else if (!filename) {
      console.log("Could not write faqdata, could not find file related to topic.")
      res.send("No file found for topic.")
    }
    else {
      fs.writeFileSync(`./data/${filename}`, JSON.stringify(req.body.data))
      console.log(`${filename} has been updated.`)
      res.send(`${filename} has been updated.`)
    }
  }

  static async getFAQTopics(req, res, next) {
    res.json({topics: Object.keys(topicToFileMapping)})
  }

  static async processCSV(req, res, next) {
    var file = req.file
    var results = []


    fs.createReadStream(file.path)
    .pipe(csvReader(["Index", "Question", "Answer", 'Alternatives']))
    .on('data', (data) => {
      data.Alternatives = []
      results.push(data)
    })
    .on('end', () => {
      if (fs.existsSync(file.path)) { // clean original file after converting
          fs.unlinkSync(file.path)
      }
      res.json({data: results})
    })
  }
}

module.exports = FAQDataController
