readJSONFIle()

function readJSONFIle(){
    var fs = require('fs');

    fs.readFile('../flaskservice/dataConstruction/babybonusintents.json','utf8', function(err, contents) {
        const obj = JSON.parse(contents)
        num_intents = Object.keys(obj.intents).length
        console.log(num_intents)
        index = 0
        
        for(var i = 0; i< num_intents;i++){
            tag = obj.intents[i].tag
            question = "tag" + index;
            response = obj.intents[i].response
            if (typeof response === "undefined"){
                response = "none"
            }else{
                response = obj.intents[i].response
            }
            pattern = obj.intents[i].patterns
            intentCreation(question, pattern, response)
            index ++
        }
    });
    
}

async function intentCreation(question, pattern, response){

    const projectId = "chatbot-development-250810"

    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');

    // Instantiates the Intent Client
    const intentsClient = new dialogflow.IntentsClient();

    // The path to identify the agent that owns the created intent.
    const agentPath = intentsClient.projectAgentPath(projectId);

    const trainingPhrases = [];

    var trainingPhrasesParts = pattern;

    trainingPhrasesParts.forEach(trainingPhrasesPart => {
        const part = {
            text: trainingPhrasesPart,
        };

        // Here we create a new training phrase for each provided part.
        const trainingPhrase = {
            type: 'EXAMPLE',
            parts: [part],
        };

        trainingPhrases.push(trainingPhrase);
    });

    const messageText = {
        text: [response],
    };

    const message = {
        text: messageText,
    }

    const intent = {
        displayName: question,
        trainingPhrases: trainingPhrases,
        messages: [message],
    };

    const createIntentRequest = {
    parent: agentPath,
    intent: intent,
    };

    // Create the intent
    const responses = await intentsClient.createIntent(createIntentRequest);
    console.log(`Intent ${responses[0].name} created`);


}