import React,{Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Record from '../Record';
import io from 'socket.io-client'
import axios from "axios";
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import Dialogflow from './Dialogflow';
import DNN from './DNN';
import Jamie from "./Jamie";
import MICL from "./MICL";
import UploadBox from "./UploadBox";
import AudioUpload from "./Audiofile";
import Rajat from "./Rajat";
import Rushi from "./Rushi";
import AISG from "../img/aisg.png";
import MSF from "../img/msf.png";
import NTU from "../img/ntu.png";
import NUS from "../img/nus.png";
import {Tab, Tabs} from "react-bootstrap";
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'



const content={flexgrow: 1, height: '100vh', overflow:'auto'};
const container={paddingTop: '50px', paddingBottom:'10px'};
const textPosition ={paddingLeft: '10px', paddingTop:'10px', paddingBottom:'10px'};

class Dashboard extends Component{

  constructor(props) {
    super(props);
    this.state = {
        //Direct Query
        input:"",

        responseDialogflow:"",
        responseDNN:"",
        responseJamie:"",
        responseMICL:"",
        responseRajat: "",
        responseRushi: "",

        loadingJamie:false,
        loadingDialogflow:false,
        loadingDNN: false,
        loadingMICL: false,
        loadingRajat: false,
        loadingRushi: false,

        similarityDialog: false,
        similarityDNN: false,
        similarityMICL: false,
        similarityRajat: false,
        similarityRushi: false,

        scoreDialog: 0,
        scoreDNN: 0,
        scoreMICL: 0,
        scoreRajat: 0,
        scoreRushi: 0,

        choice: "",
        reccommendation: [],
        checkDialog: true,
        checkDNN: false,
        checkMICL: true,
        checkRajat: true,
        checkRushi: true,

        topic: "babybonus", // babybonus, covid19,
        availableDialog: true,
        availableMICL: true,
        availableRajat: true,
        availableRushi: true,
        // set availability at handleTopicChange() function

        responseScoreArray: [],
        trackScore:[],

        //Speech to Text
        backendUrl: process.env.REACT_APP_API,
        isSocketReady: false,
        isBusy: false,
        socket: null,
        partialResultAISG: "",
        partialResultGoogle: "",
        transcriptionAISG: "",
        transcriptionGoogle: "",
        streamOpenAISG: false,
        streamOpenGoogle: false,

        //Switch
        switch: false,
    }

    this.setState = this.setState.bind(this)

    //Action Listeners Method Bindings
    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);

    //Summarizer Method Binding
    this.summarizer = this.summarizer.bind(this);

    //Similarity Check Method Bindings
    this.checkSimilarityDNN = this.checkSimilarityDNN.bind(this);
    this.checkSimilarityDialog = this.checkSimilarityDialog.bind(this);
    this.checkSimilarityMICL = this.checkSimilarityMICL.bind(this);
    this.checkSimilarityRajat = this.checkSimilarityRajat.bind(this);
    this.checkSimilarityRushi = this.checkSimilarityRushi.bind(this);

    //Response Comparison Method Bindings
    this.APICallResponseCompare = this.APICallResponseCompare.bind(this);
    this.comparison = this.comparison.bind(this);

    //API Call Method Bindings
    this.askJamieAPI = this.askJamieAPI.bind(this);
    this.dialogflowAPI = this.dialogflowAPI.bind(this);
    this.dnnAPI = this.dnnAPI.bind(this);
    this.miclAPI = this.miclAPI.bind(this);
    this.rajatAPI = this.rajatAPI.bind(this);
    this.rushiAPI = this.rushiAPI.bind(this);

    // Question Topic Method Bindings
    this.handleTopicChange = this.handleTopicChange.bind(this)
  }

  //Response summarizer
  summarizer(result){
    var array = []
    var summary = "";
    array = result.split(" ")
    if (array.length < 40){
      summary = result
    }else{
      for (var i = 0;i<40;i++){
        if (i === 39){
          summary += array[i] + "..."
        }else{
          summary += array[i] + " "
        }
      }
    }

    return summary
  }

  //User input handling
  handleInput(e) {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({[name]:value})
  }

  //Response comparison function. Parameters(Array of Response Pair)
  async APICallResponseCompare(req, callback){
    await axios.post(`${process.env.REACT_APP_API}/flask/api/responseCompare`,req)
        .then((res)=>{
            let probability = res.data.reply
            if (probability !== -1){
              callback(probability)
            }
        }).catch(error=>{
          console.log("Error Contacting API server")
        });

  }

  //checkSimilarity method prefix updates response comparison scores
  checkSimilarityDialog(score){
    this.setState({scoreDialog:score})
    this.setState({similarityDialog: true})
  }

  checkSimilarityDNN(score){
    this.setState({scoreDNN:score})
    this.setState({similarityDNN:true})
  }

  checkSimilarityMICL(score){
    this.setState({scoreMICL:score})
    this.setState({similarityMICL:true})
  }

  checkSimilarityRajat(score){
    this.setState({scoreRajat:score})
    this.setState({similarityRajat:true})
  }

  checkSimilarityRushi(score){
    this.setState({scoreRushi:score})
    this.setState({similarityRushi:true})
  }

  //API Chatbot services for interation simulation
  askJamieAPI(params){
    return new Promise(function(resolve,reject){
      axios.post(`${process.env.REACT_APP_API}/jamie/api/askJamieFast`, params)
      .then((res)=>{
          resolve(res.data.reply)
      })
      .catch(error=>{
          console.log("Error contacting Ask Jamie")
      });
    })
  }

  dialogflowAPI(params){
    return new Promise(function(resolve,reject){
      axios.post(`${process.env.REACT_APP_API}/dialog/api/dialogflow`, params)
      .then((res)=>{
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Dialogflow")
      });
    })
  }

  dnnAPI(params){
    return new Promise(function(resolve, reject){
      axios.post(`${process.env.REACT_APP_API}/flask/api/russ_query`, params)
      .then((res)=>{
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Flask server")
      })
    })
  }

  miclAPI(params){
    return new Promise(function(resolve, reject){
      axios.post(`${process.env.REACT_APP_API}/micl/api/directQuery`, params)
      .then((res)=>{
        // that.setState({reccommendation: res.data.queries})
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting MICL server")
      })
    })
  }

  rajatAPI(params){
    return new Promise(function(resolve, reject){
      axios.post(`${process.env.REACT_APP_API}/rajat/api/queryEndpoint`, params)
      .then((res)=>{
        console.log(res)
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Rajat server")
      })
    })
  }

  rushiAPI(params){
    return new Promise(function(resolve, reject){
      axios.post(`${process.env.REACT_APP_API}/rushi/api/queryEndpoint`, params)
      .then((res)=>{
        console.log(res)
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Rushi server")
      })
    })
  }

  // Make sure responses are present before executing response comparison
  comparison(){

    if(this.state.checkDialog){
      let req = {responses: [this.state.responseDialogflow, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityDialog)
      }catch(e){
        console.log("Comparison Error")
      }
    }

    if(this.state.checkDNN){
      let req = {responses: [this.state.responseDNN, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityDNN);
      }catch(e){
        console.log("Comparison Error")
      }
    }

    if(this.state.checkMICL){
      let req = {responses: [this.state.responseMICL, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityMICL);
      }catch(e){
        console.log("Comparison Error")
      }
    }

    if(this.state.checkRajat){
      let req = {responses: [this.state.responseRajat, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityRajat);
      }catch(e){
        console.log("Comparison Error")
      }
    }

    if(this.state.checkRushi){
      let req = {responses: [this.state.responseRushi, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityRushi);
      }catch(e){
        console.log("Comparison Error")
      }
    }
  }

  // On input submit action handler
  async handleClick(){

    if (this.state.input === "") return;

    // Reset comparison score value
    this.setState({
      similarityDialog: false,
      similarityDNN: false,
      similarityMICL: false,
      similarityRajat: false,
      similarityRushi: false,
    })

    // Construct input object
    var params = {
      question: this.state.input,
      topic: this.state.topic,
    }

    var promiseArray = []
    // make askJamie call
    this.setState({loadingJamie: true})
    var askJamiePromise = this.askJamieAPI(params)
    promiseArray.push(askJamiePromise)

    askJamiePromise.then( res => {
      let summarized = this.summarizer(res)
      this.setState({
        responseJamie: summarized,
        loadingJamie: false,
      })
    })

    // make Dialogflow call
    if (this.state.checkDialog) {
      this.setState({loadingDialogflow: true})
      var dialogFlowPromise = this.dialogflowAPI(params)
      promiseArray.push(dialogFlowPromise)

      dialogFlowPromise.then( res => {
        let summarized = this.summarizer(res)
        this.setState({
          responseDialogflow: summarized,
          loadingDialogflow: false,
        })
      })
    }
    // make DNN call
    if (this.state.checkDNN){
      this.setState({loadingDNN: true})
      var dnnPromise = this.dnnAPI(params)
      promiseArray.push(dnnPromise)

      dnnPromise.then( res => {
        let summarized = this.summarizer(res)
        this.setState({
          responseDNN: summarized,
          loadingDNN: false,
        })
      })
    }
    // make MICL call
    if (this.state.checkMICL){
      this.setState({loadingMICL: true})
      var miclPromise = this.miclAPI(params)
      promiseArray.push(miclPromise)

      miclPromise.then( res => {
        let summarized = this.summarizer(res)
        this.setState({
          responseMICL: summarized,
          loadingMICL: false,
        })
      })
    }
    // make Rajat call
    if (this.state.checkRajat){
      this.setState({loadingRajat: true})
      var rajatPromise = this.rajatAPI(params)
      promiseArray.push(rajatPromise)

      rajatPromise.then( res => {
        let summarized = this.summarizer(res)
        this.setState({
          responseRajat: summarized,
          loadingRajat: false,
        })
      })
    }
    // make Rushi call
    if (this.state.checkRushi){
      this.setState({loadingRushi: true})
      var rushiPromise = this.rushiAPI(params)
      promiseArray.push(rushiPromise)

      rushiPromise.then( res => {
        let summarized = this.summarizer(res)
        this.setState({
          responseRushi: summarized,
          loadingRushi: false,
        })
      })
    }

    // Bind this to variable for use in promise
    let that = this;

    // Promise of Chatbot Services
    await Promise.all(
      promiseArray
    ).then( values => {
      console.log(values)
      // On successful chatbot interaction, execute comparison for each chatbot response pair
      that.comparison()
    })
  }

  //Handles selection of Chatbot services through checkboxes
  handleCheck(e){
    let name = e.target.name;
    let value = e.target.value;
    this.setState({[name]: e.target.checked})

    // if unchecked, clear response
    if (!e.target.checked) {
      this.setState({
        [`response${value}`]:""
      })
    }
  }

  //Handle switch mechanism for text/speech input switches
  handleChange(e) {
    let name = e.target.name;
    this.setState({[name]:e.target.checked})
    this.reset()

    //Hacky method to trigger socket initiation when switch is pushed
    if(this.state.switch===false){
      this.initSockets()
    }

    if(this.state.switch===true){
      this.state.socket.disconnect()
    }
  }

  //Socket initialization for speech queries
  initSockets() {
    const socket = io(this.state.backendUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      // reconnectionAttempts: Infinity
      reconnectionAttempts: 2
    })

    socket.on('connect', () => {
      console.log('socket connected!')
      this.setState({
        socket: socket,
        isSocketReady: true,
      })
    })

    socket.on('stream-ready-aisg', () => {
      this.setState({streamOpenAISG: true,})
    })

    socket.on('stream-ready-google', () => {
      this.setState({streamOpenGoogle: true,})
    })

    socket.on('stream-data-google', data => {

      if (data.results[0].isFinal) {
        this.setState(prevState => ({
          transcriptionGoogle: prevState.transcriptionGoogle + data.results[0].alternatives[0].transcript,
          partialResultGoogle: ''
        }))

        } else {
          this.setState(prevState => ({
            partialResultGoogle: '[...' + data.results[0].alternatives[0].transcript + ']'
          }))
        }
    })

    socket.on('stream-data-aisg', data => {
      if (data.result.final) {
        this.setState(prevState => ({
          transcriptionAISG: prevState.transcriptionAISG.slice(0,-1) + ' ' + data.result.hypotheses[0].transcript,
          partialResultAISG: ''
        }))

      } else {
        // this.setState({input:""})
        this.setState(prevState => ({
          partialResultAISG: '[...' + data.result.hypotheses[0].transcript + ']'
        }))
      }
    })

    socket.on('stream-close-aisg', () => {
      this.setState(prevState => ({
        streamOpenAISG: false,
        isBusy: prevState.streamOpenGoogle,
      }))
    })

    socket.on('stream-close-google', () => {
      this.setState(prevState => ({
        streamOpenGoogle: false,
        isBusy: prevState.streamOpenAISG,
      }))
    })
  }

  reset = () => {
    this.setState({
      input: '',
      partialResultAISG: '',
      partialResultGoogle: '',
      transcriptionAISG: '',
      transcriptionGoogle: '',
      responseDialogflow:"",
      responseDNN:"",
      responseJamie:"",
      responseMICL:"",
      responseRajat: "",
      responseRushi: "",
      similarityDialog: false,
      similarityDNN: false,
      similarityMICL: false,
      similarityRajat: false,
      similarityRushi: false,
    })
  }

  //Handle question topic change
  handleTopicChange(e, value) {
    this.setState({topic:value})
    // reset responses only
    this.setState({
      responseDialogflow: "",
      responseDNN: "",
      responseJamie: "",
      responseMICL: "",
      responseRajat: "",
      responseRushi: "",
      similarityDialog: false,
      similarityDNN: false,
      similarityMICL: false,
      similarityRajat: false,
      similarityRushi: false,
    })

    switch (value) {
      case 'babybonus':
        this.setState({
          availableDialog: true,
          availableMICL: true,
          availableRajat: true,
          availableRushi: true,
          checkDialog: true,
          checkMICL: true,
          checkRajat: true,
          checkRushi: true,
        })
        break
      case 'covid19':
        this.setState({
          availableDialog: true,
          availableMICL: false,
          availableRajat: true,
          availableRushi: true,
          checkDialog: true,
          checkMICL: false,
          checkRajat: true,
          checkRushi: true,
        })
        break
      case 'comcare':
        this.setState({
          availableDialog: false,
          availableMICL: false,
          availableRajat: false,
          availableRushi: true,
          checkDialog: false,
          checkMICL: false,
          checkRajat: false,
          checkRushi: true,
        })
        break
      default:
        break
    }
  }

  render(){
    return (

      <div>
        <CssBaseline />

        <main style={content}>
            <Container maxWidth="lg" style={container}>

            <Grid container style={{paddingBottom:"40px"}} justify="center">
              <Grid item xs={8} md={2} style={{textAlign:"center"}}>
                    <img src={AISG} style={{width: '80px', height:'70px'}} alt="AISG Logo"/>
              </Grid>
              <Grid item xs={8} md={2} style={{textAlign:"center"}}>
                  <img src={NTU} style={{width: '160px', height:'70px'}} alt="NTU Logo"/>
              </Grid>
              <Grid item xs={8} md={2} style={{textAlign:"center"}}>
                    <img src={NUS} style={{width: '160px', height:'70px'}} alt="NUS Logo"/>
              </Grid>
              <Grid item xs={8} md={2} style={{textAlign:"center"}}>
                    <img src={MSF} style={{width: '160px', height:'70px'}} alt="MSF Logo"/>
              </Grid>

            </Grid>

            <Tabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">

            <Tab eventKey="dashboard" title="Multi-Chatbot Interface">

            <br/><br/>

            <Grid container style={{paddingBottom:"40px"}} justify="center">

            <Card>
              <CardContent style={{width:"500px"}}>
                <Typography color="textSecondary" gutterBottom>
                  Multi Chatbot Interface for Response Comparisons
                </Typography>
                <Typography color="textSecondary">

                </Typography>
                <Typography variant="body2" component="p">
                  1. Selection of Chatbot Services
                  <br />
                  2. Choose between Text(Default) or Realtime Speech Input
                  <br />
                  3. Real-time Speech allows choice of Google or AISG Transcription Services
                </Typography>
              </CardContent>

            </Card>

            </Grid>

            <Grid container spacing={3} style={{paddingBottom:'30px'}}>

              {/* Switch for text and speech */}
              <Grid item xs={12} md={12} style={{textAlign:"center"}}>
                <FormControlLabel
                  control = {<Switch
                              checked={this.state.switch}
                              onChange={this.handleChange}
                              value="checkedA"
                              name="switch"
                              inputProps={{ 'aria-label': 'secondary checkbox' }}
                              label="Switch between Text and Speech"
                              disabled={this.state.isBusy}
                              />}
                  label="SWITCH BETWEEN TEXT AND SPEECH"
                />
              </Grid>

              {/* Text Input */}
              <Grid item xs={12} md={6} lg={6}>

                {this.state.switch &&
                <Paper style={textPosition}>
                  <Typography variant="h5" component="h3">
                    Text Input Disabled.
                  </Typography>
                  <Typography component="p">
                    Select switch to enable text
                </Typography>
                </Paper>
                }

                {this.state.switch === false &&
                <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="outlined-adornment-amount">Input</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  startAdornment={<InputAdornment position="start">FAQ</InputAdornment>}
                  labelWidth={60}
                  name="input"
                  value={this.state.input}
                  onChange={this.handleInput}
                />
                <Button onClick={this.handleClick}  variant="contained" color="primary">Submit</Button>
                </FormControl>
                }


              </Grid>

              {/* Speech-to-Text */}
              <Grid item xs={12} md={6} lg={6}>

                {this.state.switch &&
                <Record
                transcriptionAISG= {this.state.transcriptionAISG}
                transcriptionGoogle = {this.state.transcriptionGoogle}
                partialResultAISG = {this.state.partialResultAISG}
                partialResultGoogle = {this.state.partialResultGoogle}
                input = {this.state.input}
                socket={this.state.socket}
                isBusy={this.state.isBusy}
                isSocketReady={this.state.isSocketReady}
                backendUrl={this.state.backendUrl}
                reset={this.reset}
                setState={this.setState}
                handleClick = {this.handleClick}
                />
                }

                {this.state.switch ===false &&
                <Paper style={textPosition}>
                  <Typography variant="h5" component="h3">
                    Speech to Text Disabled.
                  </Typography>
                  <Typography component="p">
                    Select switch to enable speech
                  </Typography>
                </Paper>
                }

              </Grid>

              {/* Question topic and Chatbot services */}
              <Grid item container xs={12} spacing={0}>
                {/* Question Topic Selection */}
                <Grid item xs={12}>

                  <Typography variant='h5'>
                  Question Topic:
                  </Typography>

                  <RadioGroup aria-label="topic selection" name="topic selection"
                  value={this.state.topic} onChange={this.handleTopicChange} row>
                    <FormControlLabel
                    value="babybonus"
                    label="Baby Bonus"
                    control={<Radio color="primary" />}
                    />
                    <FormControlLabel
                    value="covid19"
                    label="Covid-19"
                    control={<Radio color="primary" />}
                    />
                    <FormControlLabel
                    value="comcare"
                    label="ComCare"
                    control={<Radio color="primary" />}
                    />
                  </RadioGroup>

                </Grid>

                {/* Chatbot Selection */}
                <Grid item xs={12}>

                  <Typography variant='h5'>
                  Select Chatbot Services:
                  </Typography>

                  <FormGroup row>
                    {this.state.availableDialog &&
                    <FormControlLabel
                      control={<Checkbox checked={this.state.checkDialog} name="checkDialog" value="Dialogflow" onChange={this.handleCheck}/>}
                      label="Dialogflow"
                    />}
                    {this.state.availableMICL &&
                    <FormControlLabel
                      control={<Checkbox checked={this.state.checkMICL} name="checkMICL" value="MICL" onChange={this.handleCheck}/>}
                      label="Andrew"
                    />}
                    {this.state.availableRajat &&
                    <FormControlLabel
                      control={<Checkbox checked={this.state.checkRajat} name="checkRajat" value="Rajat" onChange={this.handleCheck}/>}
                      label="Rajat"
                    />}
                    {this.state.availableRushi &&
                    <FormControlLabel
                      control={<Checkbox checked={this.state.checkRushi} name="checkRushi" value="Rushi" onChange={this.handleCheck}/>}
                      label="Rushi"
                    />}
                  </FormGroup>

                </Grid>
              </Grid>

              {this.state.switch === true &&
              <Grid item xs={12} >
                <h6>Transcription: {this.state.input}</h6>
              </Grid>
              }

              <Grid item xs={12} md={4}>
                <Jamie
                  loadingJamie = {this.state.loadingJamie}
                  responseJamie = {this.state.responseJamie}
                />
              </Grid>

              {this.state.checkDNN &&
              <Grid item xs={12} md={4}>
                <DNN
                  similarityDNN = {this.state.similarityDNN}
                  loadingDNN = {this.state.loadingDNN}
                  responseDNN = {this.state.responseDNN}
                  choice = {this.state.choice}
                  // handleChoice = {this.handleChoice}
                  reccommendation = {this.state.reccommendation}
                  scoreDNN = {this.state.scoreDNN}
                />
              </Grid>
              }

              {this.state.checkDialog &&
              <Grid item xs={12} md={4}>
                <Dialogflow
                  similarityDialog = {this.state.similarityDialog}
                  loadingDialogflow = {this.state.loadingDialogflow}
                  responseDialogflow = {this.state.responseDialogflow}
                  scoreDialog = {this.state.scoreDialog}
                />
              </Grid>
              }

              {this.state.checkMICL &&
              <Grid item xs={12} md={4}>
                <MICL
                  similarityMICL = {this.state.similarityMICL}
                  loadingMICL = {this.state.loadingMICL}
                  responseMICL = {this.state.responseMICL}
                  scoreMICL = {this.state.scoreMICL}
                />
              </Grid>
              }

              {this.state.checkRajat &&
              <Grid item xs={12} md={4}>
                <Rajat
                  similarityRajat = {this.state.similarityRajat}
                  loadingRajat = {this.state.loadingRajat}
                  responseRajat = {this.state.responseRajat}
                  scoreRajat = {this.state.scoreRajat}
                />
              </Grid>
              }

              {this.state.checkRushi &&
              <Grid item xs={12} md={4}>
                <Rushi
                  similarityRushi = {this.state.similarityRushi}
                  loadingRushi = {this.state.loadingRushi}
                  responseRushi = {this.state.responseRushi}
                  scoreRushi = {this.state.scoreRushi}
                />
              </Grid>
              }

            </Grid>

            </Tab>

            <Tab eventKey="chart" title="Performance Analysis">
            <br/><br/>
            <Grid container spacing={3} style={{paddingBottom:"40px"}}>

              <Grid item xs={12} md={12}>
                <UploadBox
                askJamieAPI={this.askJamieAPI}
                dialogflowAPI={this.dialogflowAPI}
                miclAPI={this.miclAPI}
                rajatAPI={this.rajatAPI}
                rushiAPI={this.rushiAPI}/>

              </Grid>
            </Grid>

            </Tab>

            {/* AudioUpload(Audiofile.jsx) component to be worked on by Damien */}
            <Tab eventKey="Audio" title="Transcription Comparison">
            <br/><br/>
              <AudioUpload
              backendUrl={this.state.backendUrl}
              />
            </Tab>

            </Tabs>
            </Container>

        </main>
      </div>
    );
  }
}

export default Dashboard
