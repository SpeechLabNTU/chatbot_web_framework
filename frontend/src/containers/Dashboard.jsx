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
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Jamie from "./Jamie";
import AnswerModel from "./AnswerModel";
import UploadBox from "./UploadBox";
import AudioUpload from "./Audiofile";
import AISG from "../img/aisg.png";
import MSF from "../img/msf.png";
import NTU from "../img/ntu.png";
import NUS from "../img/nus.png";
import ReactTab from "react-bootstrap/Tab"
import ReactTabs from "react-bootstrap/Tabs"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TabPanel from "./TabPanel"
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Collapse from '@material-ui/core/Collapse';

const content={flexgrow: 1, height: '100vh', overflow:'auto'};
const container={paddingTop: '50px', paddingBottom:'10px'};


class Dashboard extends Component{

  constructor(props) {
    super(props);
    this.state = {
        //Direct Query
        input:"",
        similarQuestions: undefined,

        responseDialogflow:"",
        responseJamie:"",
        responseMICL:"",
        responseRajat: "",
        responseRushi: "",

        loadingJamie:false,
        loadingDialogflow:false,
        loadingMICL: false,
        loadingRajat: false,
        loadingRushi: false,

        similarityDialog: false,
        similarityMICL: false,
        similarityRajat: false,
        similarityRushi: false,

        scoreDialog: 0,
        scoreMICL: 0,
        scoreRajat: 0,
        scoreRushi: 0,

        choice: "",
        checkDialog: true,
        checkMICL: true,
        checkRajat: true,
        checkRushi: true,
        chatbotMenuRef: null,

        topicMenuRef: null,
        topic: "Baby Bonus", // Baby Bonus, Covid 19, ComCare
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
        inputMethod: 0,
    }

    this.setState = this.setState.bind(this)

    //Action Listeners Method Bindings
    this.handleCheck = this.handleCheck.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);

    //Summarizer Method Binding
    this.summarizer = this.summarizer.bind(this);

    //Similarity Check Method Bindings
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
    this.miclAPI = this.miclAPI.bind(this);
    this.rajatAPI = this.rajatAPI.bind(this);
    this.rushiAPI = this.rushiAPI.bind(this);

    // Question Topic Method Bindings
    this.handleTopicChange = this.handleTopicChange.bind(this)
    this.handleInputMethodChange = this.handleInputMethodChange.bind(this)
  }

  //Response summarizer
  summarizer(result){
    var array = []
    var summary = "";
    if (result===undefined) return ""
    array = result.split(" ").filter(i => i !== "")

    for (var i = 0; i < array.length; i++){
      summary += array[i] + " "
    }

    return summary.trim()
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

  miclAPI(params){
    return new Promise(function(resolve, reject){
      axios.post(`${process.env.REACT_APP_API}/micl/api/directQuery`, params)
      .then((res)=>{
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
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Rajat server")
      })
    })
  }

  rushiAPI(params){
    let that = this
    return new Promise(function(resolve, reject){
      axios.post(`${process.env.REACT_APP_API}/rushi/api/queryEndpoint`, params)
      .then((res)=>{
        that.setState({similarQuestions: res.data.similarQuestions})
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

    if (this.state.input.trim() === "") return;

    // Reset comparison score value
    this.setState({
      similarityDialog: false,
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

  //Handle tab mechanism for text/speech input switches
  handleInputMethodChange(e, newValue) {
    this.setState({inputMethod: newValue})
    this.reset()

    if (newValue===0){
      if (this.state.socket)this.state.socket.disconnect()
    } else if (newValue===1){
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
      responseJamie:"",
      responseMICL:"",
      responseRajat: "",
      responseRushi: "",
      similarityDialog: false,
      similarityMICL: false,
      similarityRajat: false,
      similarityRushi: false,
      similarQuestions: undefined,
    })
  }

  //Handle question topic change
  handleTopicChange(value) {
    this.setState({topic:value})
    // reset responses only
    this.setState({
      responseDialogflow: "",
      responseJamie: "",
      responseMICL: "",
      responseRajat: "",
      responseRushi: "",
      similarityDialog: false,
      similarityMICL: false,
      similarityRajat: false,
      similarityRushi: false,
      similarQuestions: undefined,
    })

    switch (value) {
      case 'Baby Bonus':
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
      case 'Covid 19':
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
      case 'ComCare':
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
      case 'Adoption':
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

      <React.Fragment>
        <CssBaseline />

        <main style={content}>
            <Container maxWidth="lg" style={container}>

            <Grid container style={{paddingBottom:"40px"}} justify="space-evenly" spacing={3}>
              <Grid item style={{textAlign:"center"}}>
                    <img src={AISG} style={{width: '80px', height:'70px'}} alt="AISG Logo"/>
              </Grid>
              <Grid item style={{textAlign:"center"}}>
                  <img src={NTU} style={{width: '160px', height:'70px'}} alt="NTU Logo"/>
              </Grid>
              <Grid item style={{textAlign:"center"}}>
                    <img src={NUS} style={{width: '160px', height:'70px'}} alt="NUS Logo"/>
              </Grid>
              <Grid item style={{textAlign:"center"}}>
                    <img src={MSF} style={{width: '160px', height:'70px'}} alt="MSF Logo"/>
              </Grid>

            </Grid>

            <ReactTabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">

            <ReactTab eventKey="dashboard" title="Multi-Chatbot Interface">

            <br/><br/>

            <Grid container style={{paddingBottom:"40px"}} justify="center">

            <Card>
              <CardContent style={{marginRight:10}}>
                <Typography color="textSecondary" gutterBottom>
                  Multi Chatbot Interface for Response Comparisons
                </Typography>
                <Typography color="textSecondary">

                </Typography>
                <Typography variant="body2" component="p">
                  1. Choose between Text or Realtime Speech Input
                  <br />
                  2. Selection of Question Topic and Chatbot Services
                  <br />
                  3. Real-time Speech allows choice of Google or AISG Transcription Services
                </Typography>
              </CardContent>
            </Card>

            </Grid>

            <Grid container spacing={3} style={{paddingBottom:'30px'}}>

              <Grid item container xs={12}>
                <Grid item ><Paper><Tabs
                  orientation="vertical"
                  variant="fullWidth"
                  value={this.state.inputMethod}
                  onChange={this.handleInputMethodChange}
                >
                  <Tab label="Text" />
                  <Tab label="Speech" />
                </Tabs></Paper></Grid>
                <Grid item xs={8} style={{flexGrow: 1, maxWidth:700}}>
                <Paper>
                {/* Text input */}
                <TabPanel value={this.state.inputMethod} index={0} >
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
                  <Button onClick={this.handleClick} variant="contained" color="primary">Submit</Button>
                  </FormControl>
                </TabPanel>
                {/* Speech to text */}
                <TabPanel value={this.state.inputMethod} index={1}>
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
                  <br/>
                  <h6>Transcription: {this.state.input}</h6>
                </TabPanel>
                </Paper>
                <Collapse in={this.state.similarQuestions!==undefined}><Paper>
                  <List dense>
                    <ListItem><Typography variant='h6'>You might be interested: </Typography></ListItem>
                    {this.state.similarQuestions && this.state.similarQuestions.map( (item) => {
                      if (item !== this.state.input) return (
                        <ListItem button onClick={(e)=>{
                        this.setState({input: e.target.innerText})
                        setTimeout( ()=>{this.handleClick()}, 0 )}}
                        >{item}</ListItem>
                      )
                      else return undefined
                    })}
                  </List>
                </Paper></Collapse>
                </Grid>

              </Grid>

              {/* Question topic and Chatbot services */}
              <Grid item container xs={12} spacing={1}>

                <Grid item><Paper elevation={1}><List component="nav">
                <ListItem button onClick={(event)=>{this.setState({topicMenuRef: event.currentTarget})}}>
                <ListItemText primary="Question Topic" secondary={this.state.topic} />
                </ListItem>
                </List></Paper>
                <Menu
                  anchorEl={this.state.topicMenuRef}
                  keepMounted
                  open={Boolean(this.state.topicMenuRef)}
                  onClose={()=>{this.setState({topicMenuRef:null})}}
                >
                <MenuItem id={"Baby Bonus"}
                onClick={(e)=>{
                  this.handleTopicChange(e.target.id)
                  this.setState({topicMenuRef:null})
                }}
                >Baby Bonus</MenuItem>
                <MenuItem id={"Covid 19"}
                onClick={(e)=>{
                  this.handleTopicChange(e.target.id)
                  this.setState({topicMenuRef:null})
                }}
                >Covid 19</MenuItem>
                <MenuItem id={"ComCare"}
                onClick={(e)=>{
                  this.handleTopicChange(e.target.id)
                  this.setState({topicMenuRef:null})
                }}
                >ComCare</MenuItem>
                <MenuItem id={"Adoption"}
                onClick={(e)=>{
                  this.handleTopicChange(e.target.id)
                  this.setState({topicMenuRef:null})
                }}
                >Adoption</MenuItem>
                </Menu></Grid>

                <Grid item><Paper elevation={1}><List component="nav">
                <ListItem button onClick={(event)=>{this.setState({chatbotMenuRef: event.currentTarget})}}>
                <ListItemText primary="Chatbot Services" secondary={
                  (this.state.checkDialog ? "Dialogflow " : "") +
                  (this.state.checkMICL ? "Andrew " : "") +
                  (this.state.checkRajat ? "Rajat " : "") +
                  (this.state.checkRushi ? "Rushi " : "")
                } />
                </ListItem>
                </List></Paper>
                <Menu
                  anchorEl={this.state.chatbotMenuRef}
                  keepMounted
                  open={Boolean(this.state.chatbotMenuRef)}
                  onClose={()=>{this.setState({chatbotMenuRef:null})}}
                >
                {this.state.availableDialog &&
                <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
                Dialogflow<Checkbox checked={this.state.checkDialog} name="checkDialog" value="Dialogflow" onChange={this.handleCheck}/>
                </MenuItem> }
                {this.state.availableMICL &&
                <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
                Andrew<Checkbox checked={this.state.checkMICL} name="checkMICL" value="MICL" onChange={this.handleCheck}/>
                </MenuItem> }
                {this.state.availableRajat &&
                <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
                Rajat<Checkbox checked={this.state.checkRajat} name="checkRajat" value="Rajat" onChange={this.handleCheck}/>
                </MenuItem> }
                {this.state.availableRushi &&
                <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
                Rushi<Checkbox checked={this.state.checkRushi} name="checkRushi" value="Rushi" onChange={this.handleCheck}/>
                </MenuItem> }
                </Menu></Grid>

              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Jamie
                  loadingJamie = {this.state.loadingJamie}
                  responseJamie = {this.state.responseJamie}
                />
              </Grid>

              {this.state.checkDialog &&
              <Grid item xs={12} sm={6} md={4}>
                <AnswerModel
                  value = "Dialogflow"
                  similarity = {this.state.similarityDialog}
                  loading = {this.state.loadingDialogflow}
                  response = {this.state.responseDialogflow}
                  score = {this.state.scoreDialog}
                />
              </Grid>
              }

              {this.state.checkMICL &&
              <Grid item xs={12} sm={6} md={4}>
                <AnswerModel
                  value = "Andrew"
                  similarity = {this.state.similarityMICL}
                  loading = {this.state.loadingMICL}
                  response = {this.state.responseMICL}
                  score = {this.state.scoreMICL}
                />
              </Grid>
              }

              {this.state.checkRajat &&
              <Grid item xs={12} sm={6} md={4}>
                <AnswerModel
                  value = "Rajat"
                  similarity = {this.state.similarityRajat}
                  loading = {this.state.loadingRajat}
                  response = {this.state.responseRajat}
                  score = {this.state.scoreRajat}
                />
              </Grid>
              }

              {this.state.checkRushi &&
              <Grid item xs={12} sm={6} md={4}>
                <AnswerModel
                  value = "Rushi"
                  similarity = {this.state.similarityRushi}
                  loading = {this.state.loadingRushi}
                  response = {this.state.responseRushi}
                  score = {this.state.scoreRushi}
                />
              </Grid>
              }

            </Grid>

            </ReactTab>

            <ReactTab eventKey="chart" title="Performance Analysis">
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

            </ReactTab>

            {/* AudioUpload(Audiofile.jsx) component to be worked on by Damien */}
            <ReactTab eventKey="audio" title="Transcription Comparison">
            <br/><br/>
              <AudioUpload
              backendUrl={this.state.backendUrl}
              />
            </ReactTab>

            </ReactTabs>
            </Container>

        </main>
      </React.Fragment>
    );
  }
}

export default Dashboard
