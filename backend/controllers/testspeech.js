// Imports the Google Cloud client library
const speech = require('@google-cloud/speech');
const googleclient = new speech.SpeechClient();

//Enable backend recorder 
const recorder = require('node-record-lpcm16')

//Configure transcription Request
const request = {
  config:{
      encoding: "LINEAR16",
      sampleRateHertz: 16000,
      languageCode: "en-US"
  },
  interimResults: true
}

const recognizeStream = googleclient
          .streamingRecognize(request)
          .on("error", console.error)
          .on("data", data=>{
              process.stdout.write(
                data.results[0] && data.results[0].alternatives[0]
                ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
                : '\n\nReached transcription limit'
              )
            //   console.log(data.results[0].alternatives[0].transcript)
              // io.emit('stream-data',data.results[0].alternatives[0].transcript)
        })

recorder
.record({
    sampleRateHertz: 16000,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: true,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
  })
  .stream()
  .on('error', console.error)
  .pipe(recognizeStream);


  console.log('Listening...')
