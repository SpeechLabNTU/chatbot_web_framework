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
import Charts from "./Charts";
import Chartplotly from "./Chartplotly";
import UploadBox from "./UploadBox";
import AudioUpload from "./Audiofile";
import Rajat from "./Rajat";
import AISG from "../img/AISG.png";
import MSF from "../img/MSF.png";
import NTU from "../img/NTU.png";
import NUS from "../img/nus.png";
import {Tab, Tabs} from "react-bootstrap";

const content={flexgrow: 1, height: '100vh', overflow:'auto'};
const container={paddingTop: '50px', paddingBottom:'10px'};
const textPosition ={paddingLeft: '10px', paddingTop:'10px', paddingBottom:'10px'};

class Dashboard extends Component{

  constructor(props) {
    super(props);
    this.state = {
        //Direct Query
        input:"",
        query:"",

        responseDialogflow:"",
        responseDNN:"",
        responseJamie:"",
        responseMICL:"",
        responseRajat: "",

        loadingDialogflow:false,
        loadingDNN: false,
        loadingJamie:false,
        loadingMICL: false,
        loadingRajat: false,

        comparisonJamie: false,
        comparisonDialog: false,
        comparisonDNN: false,
        comparisonMICL: false,
        comparisonRajat: false,

        similarityDialog: false,
        similarityDNN: false,
        similarityMICL: false,
        similarityRajat: false,

        scoreDialog: 0,
        scoreDNN: 0,
        scoreMICL: 0,
        scoreRajat: 0,

        choice: "",
        reccommendation: [],
        checkDialog: false,
        checkMICL: false,
        checkDNN: false,
        checkRajat: false,

        querys : [],
        responseScoreArray: [],
        trackScore:[],

        //Speech to Text
        tokenActive:false,
        audioEnable: false,
        mode: 'record',
        backendUrl: 'http://localhost:3001',
        isSocketReady: false,
        partialResult: '',
        status: 0, // 0: idle, 1: streaming, 2: finish
        isBusy: false,
        socket: null,

        //Switch
        switch: false
    }

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

    //Response Comparison Method Bindings
    this.APICallResponseCompare = this.APICallResponseCompare.bind(this);
    this.comparison = this.comparison.bind(this);

    //API Call Method Bindings
    this.askJamieAPI = this.askJamieAPI.bind(this);
    this.dialogflowAPI = this.dialogflowAPI.bind(this);
    this.dnnAPI = this.dnnAPI.bind(this);
    this.miclAPI = this.miclAPI.bind(this);
    this.rajatAPI = this.rajatAPI.bind(this);
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
    await axios.post('http://localhost:3001/flask/api/responseCompare',req)
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
  checkSimilarityDNN(score){
    this.setState({scoreDNN:score})
    this.setState({similarityDNN:true})
  }

  checkSimilarityDialog(score){
    this.setState({scoreDialog:score})
    this.setState({similarityDialog: true})
  }

  checkSimilarityMICL(score){
    this.setState({scoreMICL:score})
    this.setState({similarityMICL:true})
  }

  checkSimilarityRajat(score){
    this.setState({scoreRajat:score})
    this.setState({similarityRajat:true})
  }

  //API Chatbot services for interation simulation
  askJamieAPI(params){
    let that = this;
    this.setState({loadingJamie:true})
    return new Promise(function(resolve,reject){
      axios.post('http://localhost:3001/jamie/api/askJamieFast', params)
      .then((res)=>{
          var summarized_2 = that.summarizer(res.data.reply)
          that.setState({responseJamie:summarized_2})
          that.setState({loadingJamie:false})
          that.setState({comparisonJamie:true})
          resolve(res.data.reply)
      })
      .catch(error=>{
          console.log("Error contacting Ask Jamie")
      });

    })
  }

  dialogflowAPI(params){
    let that = this;
    this.setState({loadingDialogflow:true})
    return new Promise(function(resolve,reject){
      axios.post("http://localhost:3001/dialog/api/dialogflow", params)
      .then((res)=>{
          var summarized_1 = that.summarizer(res.data.reply)
          that.setState({responseDialogflow:summarized_1})
          that.setState({loadingDialogflow:false})
          that.setState({comparisonDialog:true})
          resolve(res.data.reply)
      })
      .catch(error=>{
          console.log("Error contacting Dialogflow")
      });
    })

  }

  dnnAPI(params){
    let that = this;
    this.setState({loadingDNN:true})
    return new Promise(function(resolve, reject){
      axios.post("http://localhost:3001/flask/api/russ_query", params)
      .then((res)=>{
            that.setState({reccommendation: res.data.queries})
            var summarized_0 = that.summarizer(res.data.reply)
            that.setState({responseDNN:summarized_0})
            that.setState({loadingDNN:false})
            that.setState({comparisonDNN:true})
            resolve(summarized_0)
      })
      .catch(error=>{
          console.log("Error contacting Flask server")
      })
    })

  }

  miclAPI(params){
    let that = this;
    this.setState({loadingMICL:true})
    return new Promise(function(resolve, reject){
      axios.post("http://localhost:3001/micl/api/directQuery", params)
      .then((res)=>{
            // that.setState({reccommendation: res.data.queries})
            var summarized_4 = that.summarizer(res.data.reply)
            that.setState({responseMICL:summarized_4})
            that.setState({loadingMICL:false})
            that.setState({comparisonMICL:true})
            resolve(res.data.reply)
      })
      .catch(error=>{
          console.log("Error contacting MICL server")
      })
    })
  }

  rajatAPI(params){
    let that = this;
    this.setState({loadingRajat:true})
    return new Promise(function(resolve, reject){
      axios.post("http://localhost:3001/rajat/api/queryEndpoint", params)
      .then((res)=>{
            var summarized_5 = that.summarizer(res.data.reply)
            that.setState({responseRajat:summarized_5})
            that.setState({loadingRajat:false})
            that.setState({comparisonRajat:true})
            resolve(res.data.reply)
      })
      .catch(error=>{
          console.log("Error contacting Rajat server")
      })
    })
  }

  //Make sure responses are present before executing response comparison
  comparison(){

    if(this.state.comparisonDialog && this.state.comparisonJamie ){
      let req = {responses: [this.state.responseDialogflow, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityDialog)
      }catch(e){
        console.log("Comparison Error")
      }
    }

    if(this.state.comparisonDNN && this.state.comparisonJamie){
      let req = {responses: [this.state.responseDNN, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityDNN);
      }catch(e){
        console.log("Comparison Error")
      }
    }

    if(this.state.comparisonMICL && this.state.comparisonJamie){
      let req = {responses: [this.state.responseMICL, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityMICL);
      }catch(e){
        console.log("Comparison Error")
      }
    }

    if(this.state.comparisonRajat && this.state.comparisonJamie){
      let req = {responses: [this.state.responseRajat, this.state.responseJamie]}
      try{
        this.APICallResponseCompare(req, this.checkSimilarityRajat);
      }catch(e){
        console.log("Comparison Error")
      }
    }
  }

  //On input submit action handler
  async handleClick(){

    //Reset comparison score value
    this.setState({similarityDialog: false})
    this.setState({similarityMICL: false})
    this.setState({similarityDNN: false})
    this.setState({query: this.state.input})

    //Construct input object
    var params = {
      question: this.state.input
    }

    //Bind this to variable for use in promise
    let that = this;

    //Promise of Chatbot Services
    await Promise.all([this.askJamieAPI(params),this.state.checkDialog && this.dialogflowAPI(params),
      this.state.checkDNN && this.dnnAPI(params), this.state.checkMICL && this.miclAPI(params),
      this.state.checkRajat && this.rajatAPI(params)]).then(function(values){
      console.log(values)

      //On successful chatbot interaction, execute comparison for each chatbot response pair
      that.comparison()
    })
  }

  //Handles selection of Chatbot services through checkboxes
  handleCheck(e){
    let name = e.target.name;
    this.setState({[name]: e.target.checked})
  }

  //Handle switch mechanism for text/speech input switches
  handleChange(e) {
    let name = e.target.name;
    this.setState({[name]:e.target.checked})
    if(this.state.switch===false){
      this.initSockets()
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
    })

    socket.on('stream-ready', () => {
      this.setState({
        isSocketReady: true,
        status: 1
      })
    })

    socket.on('stream-data-google', data => {

      if (data.results[0].isFinal) {
          this.setState(prevState => ({
          input: prevState.transcription + ' ' + data.results[0].alternatives[0].transcript,
          partialResult: ''
          }))
          this.handleClick()

      } else {
          this.setState(prevState => ({
          partialResult: '[...' + data.results[0].alternatives[0].transcript + ']'
          }))
      }
    })

    socket.on('stream-data', data => {

        if (data.result.final) {
            this.setState(prevState => ({
            input: prevState.transcription + ' ' + data.result.hypotheses[0].transcript,
            partialResult: ''
            }))
            this.handleClick()

        } else {
            // this.setState({input:""})
            this.setState(prevState => ({
            partialResult: '[...' + data.result.hypotheses[0].transcript + ']'
            }))
        }
    })

    socket.on('stream-close', () => {
      this.setState({
        status: 2,
        isBusy: false
      })
    })
    this.setState({
      socket
    })
  }

  reset = () => {
    this.setState({
      input: '',
      transcription: '',
      partialResult: ''
    })
  }

  setBusy = () => {
    this.setState({
      isBusy: true
    })
  }

  setStatus = (status) => {
    this.setState({
      status
    })
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
              <Grid item xs={8} md={2} style={{textAlign:"center", paddingLeft:"30px"}}>
                    <img src={NUS} style={{width: '160px', height:'70px'}} alt="NUS Logo"/>
              </Grid>
              <Grid item xs={8} md={2} style={{textAlign:"center", paddingLeft:"30px"}}>
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
                  Mutli Chatbot Interface for Response Comparisons
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

                <Grid item xs={12} md={12} style={{textAlign:"center"}}>

                  <FormControlLabel
                    control = {<Switch
                                checked={this.state.switch}
                                onChange={this.handleChange}
                                value="checkedA"
                                name="switch"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                label="Switch between Text and Speech"
                                />}
                    label="SWITCH BETWEEN TEXT AND SPEECH"
                  />
                </Grid>

                <Grid item xs={12} md={8} lg={6}>

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
                    onChange={this.handleInput}
                  />
                  <Button onClick={this.handleClick}  variant="contained" color="primary">Submit</Button>
                  </FormControl>
                  }


                </Grid>

                <Grid item xs={12} md={4} lg={6}>

                  {this.state.switch &&

                  <Record
                  input= {this.state.input}
                  partialResult = {this.state.partialResult}
                  socket={this.state.socket}
                  isBusy={this.state.isBusy}
                  token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzBjYmE2ZjBkNmUzMDAxYzFlNjViOSIsImlhdCI6MTU4NzExNjExOCwiZXhwIjoxNTg5NzA4MTE4fQ.VuJ8nlMvftzu0FvDkKIDECsJz_CTQwsadRcWyETV__Y"
                  isSocketReady={this.state.isSocketReady}
                  backendUrl={this.state.backendUrl}
                  reset={this.reset}
                  setBusy={this.setBusy}
                  audio={this.state.audio}
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

                <Grid item xs={12} md={12}>
                <h5>Select Chatbot Services:</h5>

                <FormGroup row>

                  <FormControlLabel
                    control={<Checkbox checked={this.state.checkDialog} name="checkDialog" value="Dialogflow" onChange={this.handleCheck}/>}
                    label="Dialogflow"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.checkMICL} name="checkMICL" value="MICL" onChange={this.handleCheck}/>}
                    label="MICL"
                  />

                  <FormControlLabel
                    control={<Checkbox checked={this.state.checkRajat} name="checkRajat" value="Rajat" onChange={this.handleCheck}/>}
                    label="Rajat"
                  />

                </FormGroup>

                </Grid>

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


            </Grid>

            </Tab>

            <Tab eventKey="chart" title="Performance Analysis">
            <br/><br/>
            <Grid container spacing={3} style={{paddingBottom:"40px"}}>

              <Grid item xs={12} md={12}>
                <UploadBox
                handleQueryInput={this.handleQueryInput}
                askJamieAPI={this.askJamieAPI}
                dialogflowAPI={this.dialogflowAPI}
                miclAPI={this.miclAPI}
                rajatAPI={this.rajatAPI}/>

              </Grid>
            </Grid>

            </Tab>

            {/* AudioUpload(Audiofile.jsx) component to be worked on by Damien */}
            <Tab eventKey="Audio" title="Transcription Comparison">
            <br/><br/>
              <AudioUpload/>
            </Tab>

            <Tab eventKey="chart2" title="Chart2">
              <br/><br/>
              <Grid container spacing={3} style={{paddingBottom:"40px"}}>
                <Grid item xs={12} md={6} lg={6}>
                  <Chartplotly responseScoreArray={this.state.responseScoreArray}/>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <UploadBox handleQueryInput={this.handleQueryInput}/>
                </Grid>
              </Grid>

            </Tab>

            </Tabs>
            </Container>

        </main>
      </div>
    );
  }
}

export default Dashboard
