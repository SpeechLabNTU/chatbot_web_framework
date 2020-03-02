async function intentListing(){

    const projectId = "chatbot-development-250810"

    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');

    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient();

    // The path to identify the agent that owns the intents.
    const projectAgentPath = intentsClient.projectAgentPath(projectId);

    const request = {
    parent: projectAgentPath,
    };

    console.log(projectAgentPath);

    // Send the request for listing intents.
    const [response] = await intentsClient.listIntents(request);

    var intentID = []
    
    response.forEach(intent => {
        var intentName = intent.name
        var myRegexp = /projects\/chatbot\-development\-250810\/agent\/intents\/(.*)/;
        var match = myRegexp.exec(intentName);
        intentID.push(match[1])
    });

    intentID.forEach(id =>{
        deleteIntent(id)
    });

}

//===========================================Delete Intent====================================================

async function deleteIntent(id){
    // Imports the Dialogflow library
    const dialogflow = require('dialogflow');
    const projectId = "chatbot-development-250810"
    const intentId = id

    // Instantiates clients
    const intentsClient = new dialogflow.IntentsClient();

    const intentPath = intentsClient.intentPath(projectId, intentId);

    const request = {name: intentPath};

    // Send the request for deleting the intent.
    const result = await intentsClient.deleteIntent(request);
    console.log(`Intent ${intentPath} deleted`);
    // return result;
}