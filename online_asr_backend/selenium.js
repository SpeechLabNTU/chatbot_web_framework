
// =============================================file upload==========================================================

function scoreResponses(query){
    const request = require('request')
    var fs = require('fs');
    var obj = JSON.parse(fs.readFileSync('QA_Sample.json','utf-8'));
    
    var promiseA = new Promise(function(resolve, reject){

        const options = {
            method: "POST",
            url: "http://155.69.146.213:5001/ask_bb/baby_bonus_faq_service",
            headers: {
                "Authorization": "Basic ",
                "Content-Type": "multipart/form-data"
            },
            formData : {
                "input" : query[0]
            }
        };
    
        request(options, function (error, response){
            responseQueryText = JSON.parse(response.body)
            // var sendBack = {fulfillmentMessages: [{"text":{"text": [responseQueryText.top1]}}]}
            //var AndrewQAresponse = sendBack.replace(/\n/g, '') 
            var AndrewQAresponse = responseQueryText.top1
            resolve({"Actual_qestion": obj[8].question, "Actual_answer": obj[8].answer, "Speech_Query":query[0], "Predicted_answer":AndrewQAresponse})
        })

    });

    var promiseB = new Promise(function(resolve, reject){

        const options = {
            method: "POST",
            url: "http://155.69.146.213:5001/ask_bb/baby_bonus_faq_service",
            headers: {
                "Authorization": "Basic ",
                "Content-Type": "multipart/form-data"
            },
            formData : {
                "input" : query[1]
            }
        };
    
        request(options, function (error, response){
            responseQueryText = JSON.parse(response.body)
            // var sendBack = {fulfillmentMessages: [{"text":{"text": [responseQueryText.top1]}}]}
            //var AndrewQAresponse = sendBack.replace(/\n/g, '') 
            var AndrewQAresponse = responseQueryText.top1
            resolve({"Actual_qestion": obj[9].question, "Actual_answer": obj[9].answer, "Speech_Query":query[1], "Predicted_answer":AndrewQAresponse})
        })

    });


    Promise.all([promiseA,promiseB]).then(function(values){
        console.log(JSON.stringify(values))
    });
}

function STT(){
    const request = require('request')
    var fs = require('fs');

    var promise1 = new Promise(function(resolve, reject){
        fs.readFile("test4.mp3", function (err, data) {
            
            const options = {
                method: "PUT",
                url: "https://sgeng-asterisk.southeastasia.cloudapp.azure.com/client/dynamic/recognize?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNmJlMTFkN2ExMTI4MDAyNDY5MmFmMyIsInVzZXJuYW1lIjoicnVzc2VsbCIsImlhdCI6MTU2NzM1MTA3NCwiZXhwIjoxNTY5OTQzMDc0fQ.unj8kxAOZf6JlRTq8T6FDV_aQ8XuzmkT547WITd97oI",
                headers: {
                    "Content-Type": "'application/octet-stream'"
                },
                body: data
            };
    
            request(options, function (error, response, body){
                output = JSON.parse(response.body)
                resolve(output.hypotheses[0].utterance)
            })
        });
    });

    var promise2 = new Promise(function(resolve, reject){
        fs.readFile("test5.mp3", function (err, data) {
            
            const options = {
                method: "PUT",
                url: "https://sgeng-asterisk.southeastasia.cloudapp.azure.com/client/dynamic/recognize?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNmJlMTFkN2ExMTI4MDAyNDY5MmFmMyIsInVzZXJuYW1lIjoicnVzc2VsbCIsImlhdCI6MTU2NzM1MTA3NCwiZXhwIjoxNTY5OTQzMDc0fQ.unj8kxAOZf6JlRTq8T6FDV_aQ8XuzmkT547WITd97oI",
                headers: {
                    "Content-Type": "'application/octet-stream'"
                },
                body: data
            };
    
            request(options, function (error, response, body){
                output = JSON.parse(response.body)
                resolve(output.hypotheses[0].utterance)
            })
        });
    });

    
    Promise.all([promise1, promise2]).then(function(values){
        //scoreResponses(values)
        console.log(values)
    });
}

// STT()


// =============================================Read CSV file==========================================================

// const fs = require('fs');
// var obj = JSON.parse(fs.readFileSync('QA_Sample.json','utf-8'));
// console.log(obj)

// console.log(obj[2].answer)

// const csv = require('csv-parser');
// const fs = require('fs');

// fs.createReadStream('msf_baby_bonus.csv')
//   .pipe(csv())
//   .on('data', (row) => {
//     console.log(row);
//   })
//   .on('end', () => {
//     console.log('CSV file successfully processed');
//   });

// =============================================Selenium crawler==========================================================

//askjamie()

function askjamie()
{
    questions = ["when can i get the cash gift from the baby bonus.",
        "can the cda be used for other siblings of my children.",
        "do i need any documents to join their baby bonus scheme.",
        "is there a limit to the number of cda accounts for family.",
        "what should i do if i don't have a singpass account.",
        "what should i do if my payment for the birth but registration is rejected.",
        "this my organization able to withdraw from the approved institutions status.",
        "are the children of unmarried parents able to join or baby bonuses.",
        "can i use an overseas or what number during birth registration.",
        "for more information or feedback or approve institute who do i contact."]
    
    example(questions[9])
}

async function example(query){
  const {Builder, By, Key, until} = require('selenium-webdriver');
    var chrome = require('selenium-webdriver/chrome');
    var options = new chrome.Options().headless();

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    try {
        await driver.get('https://www.babybonus.msf.gov.sg');
        await driver.findElement(By.name('chat_input')).sendKeys(query, Key.RETURN);
        await driver.wait(until.elementLocated(By.className('speech\-bubble1')),10000)
        
    } finally {
        var replyPromise = driver.findElement(By.className('last_li'))
                                    .findElement(By.className('speech\-bubble1'))
                                    .findElement(By.tagName('div')).getText();
        
        replyPromise.then((text)=>{
            comparison(text)
            driver.quit()
        });
    }
}

function comparison(text){
    var remove_break = text.replace(/\n/g, '') 
    var json = {"predicted_answer":remove_break}
    console.log(JSON.stringify(json))
}


// =============================================Ask Jamie API crawler====================================================

function askJamieAPI(){


    const fs = require('fs');
    fs.writeFile("questions.txt", "How to find more information about baby bonus?", function(err) {

        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })

    const { spawn } = require('child_process');
    const pyProg = spawn('python3', ['ask_jamie.py','--test_questions', 'questions.txt']);

    pyProg.stdout.on('data', function(data) {
        console.log(data.toString());
        // res.write(data);
        // res.end('end');
    });

}

// askJamieAPI()

// =============================================Dialogflow library======================================================

const dialogflow = require('dialogflow');
const uuid = require('uuid');

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used
 */
runSample()

async function runSample(projectId = 'chatbot-development-250810') {
  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: 'Find more information about baby bonus',
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;

  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentMessages[0].text.text[0]}`);
  if (result.intent) {
    console.log(`  Intent: ${result.intent.displayName}`);
  } else {
    console.log(`  No intent matched.`);
  }
}
