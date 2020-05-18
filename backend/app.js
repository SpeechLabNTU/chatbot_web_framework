const express = require('express');
const dialogflowRouter = require('./routes/dialogflow');
const miclRouter = require('./routes/micl');
const flaskRouter = require('./routes/flask');
const askJamieRouter = require('./routes/askJamie');
const rajatRouter = require('./routes/rajat.js');
const STT = require('./controllers/MainController');
const upload = require('./upload');
const AC = require('./controllers/AudioController')

const app = express();

app.use(require('cors')({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/dialog', dialogflowRouter);
app.use('/micl', miclRouter);
app.use('/flask', flaskRouter);
app.use('/jamie', askJamieRouter);
app.use('/rajat', rajatRouter);

app.post('/stream/google', STT.googlestreamByRecording)
app.post('/stream/record', STT.streamByRecording)
app.post('/stream/import', upload.single('file'), STT.streamByImport)
app.post('/api/speechlabs', upload.single('file'), AC.convertToWAV, STT.speechLabsHTTPRequest)
app.post('/api/google', upload.single('file'), AC.convertToWAV, STT.googleHTTPRequest)

module.exports = app




