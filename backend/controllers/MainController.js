const WebSocketClient = require('websocket').client
const io = require('../io')
const spawn = require('child_process').spawn
const fs = require('fs')
const dotenv = require('dotenv');
dotenv.config();

const englishOnlineServerUrl = process.env.SPEECH_API // this is address for english model, change it to your target model (malay, chinese,...)
const speechLabsAPIUrl = process.env.SPEECH_HTTP_API  // address for AISpeechLab HTTP API access

class MainController {
  static async streamByRecordingAISG (req, res, next) {
    try {
      const token = fs.readFileSync(process.env.AISG_TOKEN, 'utf-8')
      const socket_id = req.body.socketid
      var isFinal = true
      var isWaitingToClose = false
      var emptyBufferInterval

      // in this example, client doesn't join any room. so in here we need to listen on all sockets connected to backend
      Object.keys(io.sockets.connected).forEach(key => {
        if (socket_id === key){
          io.sockets.connected[key].on('stream-input', data => {
            conn.sendBytes(data)
          })

          io.sockets.connected[key].once('stream-stop', data => {
            if (conn) {
              conn.sendBytes(data) // send remained data in buffer before closing
              if (isFinal){
                conn.sendUTF('EOS') // after this conn.close() will be called because server will stop the connection
                conn.close() // close conn immediately instead of waiting for server to close it
              }
              else {
                emptyBufferInterval = setInterval( () => {
                  conn.sendBytes(Buffer.alloc(6000))
                }, 250)
                isWaitingToClose = true
              }
            }
            // cleanup eventListeners on exit
            io.sockets.connected[key].removeAllListeners(['stream-input'])
            io.sockets.connected[key].removeAllListeners(['stream-cancel'])
          })

          io.sockets.connected[key].once('stream-cancel', () => {
            conn.close() // immediately close connection to online server
            // cleanup eventListeners on exit
            io.sockets.connected[key].removeAllListeners(['stream-input'])
            io.sockets.connected[key].removeAllListeners(['stream-stop'])
          })

          let client = new WebSocketClient()
          let conn = null

          client.on('connectFailed', (error) => {
            console.log('Connect Error: ' + error.toString())
            io.sockets.connected[key].emit('stream-close-aisg') // send close signal to client
          })

          client.on('connect', (connection) => {
            conn = connection
            console.log('WebSocket Client Connected to AISG')

            io.sockets.connected[key].emit('stream-ready-aisg') // tell frontend that socket is ready

            connection.on('error', (error) => {
              console.log('Connection Error: ' + error.toString())
            })

            connection.on('close', (res) => {
              console.log('AISG echo-protocol Connection Closed')
              io.sockets.connected[key].emit('stream-close-aisg') // send close signal to client
              client = null
            })

            connection.on('message', (message) => {
              const data = JSON.parse(message.utf8Data)
              if (data.status === 0 && data.result) { // only send data which is truely a transcription to browser
                isFinal = data.result.final
                io.sockets.connected[key].emit(`stream-data-aisg`, data)
                if (isWaitingToClose && isFinal){
                  clearInterval(emptyBufferInterval)
                  conn.sendUTF('EOS') // after this conn.close() will be called because server will stop the connection
                  conn.close() // close conn immediately instead of waiting for server to close it
                }
              }
            })
          })

          // start connect to online server
          client.connect(`${englishOnlineServerUrl}?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1?token=${token}`, null, null, null, null)

        }
      })

      return res.json({success: true})

    } catch (e) {
      return res.status(500).json({message: 'Error when streaming'})
    }
  }

  static async streamByRecordingGoogle (req, res, next) {
    try{
    // Imports the Google Cloud client library
    const speech = require('@google-cloud/speech').v1p1beta1;

    //Configure transcription Request
    const request = {
      config:{
          encoding: "LINEAR16",
          sampleRateHertz: 16000,
          languageCode: "en-US",
          useEnhanced: true,
          model: "video",
      },
      interimResults: true
    }

    let recognizeStream = null

    const socket_id = req.body.socketid
    var isFinal = true
    var isWaitingToClose = false
    var emptyBufferInterval

    // Handle Web Socket Connection
    Object.keys(io.sockets.connected).forEach(key => {
      if (socket_id === key){
        console.log('Connection Initiated')
        io.emit('stream-ready-google') // tell frontend that socket is ready

        // //Signal on socket error
        io.sockets.connected[key].on('error', (error) => {
          console.log('Connection Error: ' + error.toString())
        })

        const keyFiledir = process.env.DIALOGFLOW_KEYFILENAME_BABYBONUS // use babybonus projectid for STT

        const googleclient = new speech.SpeechClient({'keyFilename':keyFiledir});

        //Start Connection to GCLOUD
        io.sockets.connected[key].on('stream-input', data =>{

          if(!recognizeStream){
            console.log('INIT GCLOUD SPEECH')

            recognizeStream = googleclient
              .streamingRecognize(request)
              .on('error', (error)=>{
                console.log(error)
              })
              .on('data', data => {
                isFinal = data.results[0].isFinal
                io.emit('stream-data-google', data)
                // io.emit('stream-data-google', data.results[0].alternatives[0].transcript)

                if (isWaitingToClose && isFinal){
                  console.log('Google echo-protocol Connection Closed')
                  clearInterval(emptyBufferInterval)
                  recognizeStream.destroy()
                  recognizeStream = null
                  io.emit('stream-close-google') // send close signal to client
                }
              })
          }
          recognizeStream.write(new Uint8Array(data))
        })

        //Signal on socket close
        io.sockets.connected[key].once('stream-stop', (data) => {
          recognizeStream.write(data) // send last blob of data

          if (isFinal) {
            console.log('Google echo-protocol Connection Closed')
            recognizeStream.destroy()
            recognizeStream = null
            io.emit('stream-close-google') // send close signal to client
          }
          else {
            emptyBufferInterval = setInterval( () => {
              recognizeStream.write(Buffer.alloc(6000))
            }, 250)
            isWaitingToClose = true
          }

          // cleanup eventListeners on exit
          io.sockets.connected[key].removeAllListeners(['error'])
          io.sockets.connected[key].removeAllListeners(['stream-input'])
        })
      }
    })

    return res.json({
      success: true
    })

    }catch (e) {
      return res.status(500).json({
        message: 'Error when streaming'
      })
    }

  }

  static async streamByImport (req, res, next) {
    try {
      const token = req.body.token

      const ls = spawn('python', ['client_2.py', '-u', englishOnlineServerUrl, '-r', '32000', '-t', token, req.file.path])
      ls.stdout.on('data', (data) => {
        // print at the final of ASR
        // we don't actually need this event
      })
      ls.stderr.on('data', (data) => { // print during ASR
        io.emit('stream-data', {
          type: 'import',
          message: data.toString(),
          status: 1
        })
      })
      ls.on('exit', async (code) => {
        if (fs.existsSync(req.file.path)) { // clean file after streaming
          fs.unlinkSync(req.file.path)
        }

        io.emit('stream-data', { // send close message to browser
          type: 'import',
          message: 'EXIT',
          status: 0 // tell browser it finished ASR
        })
      })

      Object.keys(io.sockets.connected).forEach(key => {
        // if user manually cancel (by changing tab, close browser)
        // then we terminate the child process
        io.sockets.connected[key].on('stream-cancel', () => {
          ls.kill()
        })
      })

      return res.json({
        success: true
      })
    } catch (e) {
      return res.status(500).json({
        message: 'Error when streaming'
      })
    }
  }

  static async speechLabsHTTPRequest (req, res, next) {
    try {
      const token = fs.readFileSync(process.env.AISG_TOKEN, 'utf-8')

      var file =  JSON.parse(req.body.file)

      const ls = spawn('python3', ['speech_labs_post_req.py', '-u', speechLabsAPIUrl, '-t', token, file.path])

      ls.stdout.on('data', (data) => {
        //console.log('stdout: ' + data)
        data = JSON.parse(data)
        res.json({
          status_code: data.status_code,
          status: data.status,
          text: `${data.utterance}`,
          filename: file.originalname
        })
      })

      ls.stderr.on('data', (data) => {
        console.log('stderr: ' + data)
      })

    } catch (e) {
      console.log(e)
      return res.status(500).json({
        message: 'Error during POST request'
      })
    }
  }

  static async googleHTTPRequest (req, res, next) {
    var file =  JSON.parse(req.body.file)
    // Imports the Google Cloud client library
    const fs = require('fs');
    const speech = require('@google-cloud/speech');

    // use babybonus projectid for STT
    const keyFiledir = process.env.DIALOGFLOW_KEYFILENAME_BABYBONUS

    // Creates a client
    const client = new speech.SpeechClient({'keyFilename':keyFiledir});

    /**
     * TODO(developer): Uncomment the following lines before running the sample.
     */
    const filename = file.path;
    const encoding = 'LINEAR16';
    //const sampleRateHertz = 16000;
    const languageCode = 'en-US';

    const config = {
      encoding: encoding,
      //sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };
    const audio = {
      content: fs.readFileSync(filename).toString('base64'),
    };

    const request = {
      config: config,
      audio: audio,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    // console.log('Transcription: ', transcription);

    res.json({text: transcription})
  }
}

// static async streamByRecording (req, res, next) {
//   try {
//     const token = req.body.token

//     let client = new WebSocketClient()
//     let conn = null

//     client.on('connectFailed', (error) => {
//       console.log('Connect Error: ' + error.toString())
//       io.emit('stream-close') // send close signal to client
//     })

//     client.on('connect', (connection) => {
//       conn = connection
//       console.log('WebSocket Client Connected')

//       io.emit('stream-ready') // tell frontend that socket is ready

//       connection.on('error', (error) => {
//         console.log('Connection Error: ' + error.toString())
//       })
//       connection.on('close', () => {
//         console.log('echo-protocol Connection Closed')

//         io.emit('stream-close') // send close signal to client

//         client = null
//       })
//       connection.on('message', (message) => {
//         const data = JSON.parse(message.utf8Data)

//         if (data.status === 0 && data.result) { // only send data which is truely a transcription to browser
//           io.emit('stream-data', data)
//         }
//       })
//     })

//     // start connect to online server
//     client.connect(`${englishOnlineServerUrl}?content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1?token=${token}`, null, null, null, null)

//     // in this example, client doesn't join any room. so in here we need to listen on all sockets connected to backend
//     Object.keys(io.sockets.connected).forEach(key => {
//       console.log(key)
//       io.sockets.connected[key].on('stream-input', data => {
//         if (conn) {
//           conn.sendBytes(data)
//         }
//       })

//       io.sockets.connected[key].on('stream-stop', data => {
//         if (conn) {
//           conn.sendBytes(data) // send remained data in buffer before closing
//           conn.sendUTF('EOS') // after this conn.close() will be called because server will stop the connection
//         }
//       })

//       io.sockets.connected[key].on('stream-cancel', () => {
//         conn.close() // immediately close connection to online server
//       })



//     })

//     return res.json({
//       success: true
//     })
//   } catch (e) {
//     return res.status(500).json({
//       message: 'Error when streaming'
//     })
//   }
// }



module.exports = MainController
