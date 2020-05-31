const express = require('express');
const dialogflowRouter = require('./routes/dialogflow');

const app = express();

app.use(require('cors')({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/dialog', dialogflowRouter);


module.exports = app
