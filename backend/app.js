const express = require('express');
const dialogflowRouter = require('./routes/dialogflow');
const miclRouter = require('./routes/micl');
const flaskRouter = require('./routes/flask');
const askJamieRouter = require('./routes/askJamie');
const rajatRouter = require('./routes/rajat.js');
const STT = require('./controllers/MainController');
const upload = require('./upload');

const app = express();

app.use(require('cors')({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/dialog', dialogflowRouter);
app.use('/micl', miclRouter);
app.use('/flask', flaskRouter);
app.use('/jamie', askJamieRouter);
app.use('/rajat', rajatRouter);

app.post('/stream/record', STT.streamByRecording)
app.post('/stream/import', upload.single('file'), STT.streamByImport)

module.exports = app




