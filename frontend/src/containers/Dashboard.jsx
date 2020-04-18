import React,{Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Record from '../Record';
import io from 'socket.io-client'
import axios from "axios";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
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
import UploadBox from "./UploadBox";
import Rajat from "./Rajat";
import AISG from "../img/AISG.png";
import MSF from "../img/MSF.png";
import NTU from "../img/NTU.png";
import Banner from "./Banner";
import {Tab, Tabs} from "react-bootstrap";

const content={flexgrow: 1, height: '100vh', overflow:'auto'};
const container={paddingTop: '50px', paddingBottom:'10px'};
const textField={width:'595px'};
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
        disimilarityDialog: false,
        similarityDNN: false,
        disimilarityDNN: false,
        similarityMICL: false,
        disimilarityMICL: false,
        similarityRajat: false,
        disimilarityRajat: false,

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

    this.handleChange = this.handleChange.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.summarizer = this.summarizer.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.checkSimilarityDNN = this.checkSimilarityDNN.bind(this);
    this.checkSimilarityDialog = this.checkSimilarityDialog.bind(this);
    this.checkSimilarityMICL = this.checkSimilarityMICL.bind(this);
    this.checkSimilarityRajat = this.checkSimilarityRajat.bind(this);
    this.APICallResponseCompare = this.APICallResponseCompare.bind(this);
    this.function1 = this.function1.bind(this);
    this.function2 = this.function2.bind(this);
    this.function3 = this.function3.bind(this);
    this.function4 = this.function4.bind(this);
    this.function5 = this.function5.bind(this);
    this.comparison = this.comparison.bind(this);
    this.handleQueryInput = this.handleQueryInput.bind(this);
    this.handleSingleInput = this.handleSingleInput.bind(this);
    this.MassResponseComparison = this.MassResponseComparison.bind(this);
  }

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

  handleInput(e) {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({[name]:value})
  }

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

  //==============Similarity Comparison Checks==============

  checkSimilarityDNN(score){
    this.setState({scoreDNN:score})
    if (score < 0.4){
      this.setState({similarityDNN:false})
      this.setState({disimilarityDNN: true})
    }else{
      this.setState({similarityDNN:true})
      this.setState({disimilarityDNN:false})
    }
  }

  checkSimilarityDialog(score){
    this.setState({scoreDialog:score})
    if (score < 0.4){
      this.setState({similarityDialog:false})
      this.setState({disimilarityDialog: true})

    }else{
      this.setState({similarityDialog:true})
      this.setState({disimilarityDialog:false})
    }
  }

  checkSimilarityMICL(score){
    this.setState({scoreMICL:score})
    if (score < 0.4){
      this.setState({similarityMICL:false})
      this.setState({disimilarityMICL: true})

    }else{
      this.setState({similarityMICL:true})
      this.setState({disimilarityMICL:false})
    }
  }

  checkSimilarityRajat(score){
    this.setState({scoreRajat:score})
    if (score < 0.4){
      this.setState({similarityRajat:false})
      this.setState({disimilarityRajat: true})

    }else{
      this.setState({similarityRajat:true})
      this.setState({disimilarityRajat:false})
    }
  }


  //==============Chatbot API Service Call====================

  function1(params){
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

  function2(params){
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

  function3(params){
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

  function4(params){
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

  function5(params){
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

  MassResponseComparison(req){
    return new Promise(function(resolve, reject){
      axios.post('http://localhost:3001/flask/api/responseCompare',req)
        .then((res)=>{
            let probability = res.data.reply
            if (probability !== -1){
              resolve(probability)
            }
        }).catch(error=>{
          console.log("Error Contacting API server")
        });
        
    });
        
  }

  async handleQueryInput(content, responseSelection){
    this.setState({querys:content});
    console.log(this.state.querys)
    console.log(responseSelection)
    let functionPostArray = []
    let functionPostArrayModel = []

    if(responseSelection === "null"){
      console.log("Define QA engine first")
    }else if(responseSelection === "Dialogflow"){
        for (let i=0;i<content.length;i++){
          let ques = {question: content[i]}
          functionPostArrayModel.push(this.function1(ques))
          functionPostArray.push(this.function2(ques));
        }

        let that = this;
        let promiseArray = [functionPostArrayModel,functionPostArray]
        
        const promiseAll = Promise.all(promiseArray.map(Promise.all.bind(Promise)))
        promiseAll.then(function(value){
            console.log(value)
            let functionCompareArray = []
            for (let i =0;i<value[0].length;i++){
              let responsesArray = {responses:[value[0][i],value[1][i]]}
              functionCompareArray.push(that.MassResponseComparison(responsesArray))
            }
            Promise.all(functionCompareArray).then(function(score){
              that.setState({responseScoreArray:score})
            });

        })
    }
    
  }


  async handleSingleInput(input, responseSelection){
    if(responseSelection === "null"){
      console.log("Define QA engine first")
    }else if(responseSelection === "Dialogflow"){

        let that = this;
        let ques = {question: input}
        const promiseAll = Promise.all([this.function1(ques), this.function2(ques)]);
        promiseAll.then(function(value){
            let responsesArray = {responses:[value[0],value[1]]}
            
            Promise.all([that.MassResponseComparison(responsesArray)]).then(function(score){
              console.log(score)
              that.setState(prevState=>({
                responseScoreArray: [...prevState.responseScoreArray,score[0]]
              }))
              console.log(that.state.responseScoreArray);
            
            });

        })
    }
  }

  async handleClick(){

    this.setState({similarityDialog: false})
    this.setState({similarityMICL: false})
    this.setState({similarityDNN: false})
    this.setState({query: this.state.input})
    var params = {
      question: this.state.input
    }

    let that = this;
    await Promise.all([this.function1(params),this.state.checkDialog && this.function2(params),
      this.state.checkDNN && this.function3(params), this.state.checkMICL && this.function4(params), this.state.checkRajat && this.function5(params)]).then(function(values){
      console.log(values);
      that.comparison()
    })
    
  }

  handleChoice(e){
    
    let name = e.target.name;
    let value = e.target.value;
    this.setState({[name]:value})
    
    let params = {
      question: this.state.choice
    }

    axios.post("http://localhost:3001/flask/api/russ_query", params)
    .then((res)=>{
        if (res.status === 200){
          this.setState({reccommendation: res.data.queries})
          var summarized_0 = this.summarizer(res.data.reply)
          this.setState({responseDNN:summarized_0})
          this.setState({loadingDNN:false})
          this.setState({comparisonDNN:true})
          console.log(this.state.reccommendation[0].question)
        }else{
          console.log("DNN Error")
        }
    }).catch(() =>{
        console.log("DNN Connection Error")
    }).then(()=>{
      if(this.state.comparisonDNN && this.state.comparisonJamie){
    
        let req = {responses: [this.state.responseDNN, this.state.responseJamie]}
        try{
          this.APICallResponseCompare(req, this.checkSimilarityDNN);
        }catch(e){
          console.log("Comparison Error")
        }
      }
    })
  }

  handleCheck(e){
    let name = e.target.name;
    this.setState({[name]: e.target.checked})
  }

  handleChange(e) {
    let name = e.target.name;
    this.setState({[name]:e.target.checked})
    if(this.state.switch===false){
      this.initSockets()
    }
  }

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

    socket.on('stream-data', data => {
      
        if (data.result.final) {
            this.setState(prevState => ({
            input: prevState.transcription + ' ' + data.result.hypotheses[0].transcript,
            partialResult: ''
            }))
            this.handleClick()

        } else {
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
              <Grid item xs={6} md={2} style={{textAlign:"center"}}>
                    <img src={AISG} style={{width: '80px', height: '80px'}} alt="AISG Logo"/>
              </Grid>
              <Grid item xs={6} md={2} style={{textAlign:"center"}}>
                  <img src={NTU} style={{width: '230px', height: '80px'}} alt="NTU Logo"/>
              </Grid>
              <Grid item xs={6} md={2} style={{textAlign:"center", paddingLeft:"60px"}}>
                    <img src={MSF} style={{width: '160px', height: '80px'}} alt="MSF Logo"/>
              </Grid>
            </Grid>

            <Tabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">
            
            <Tab eventKey="dashboard" title="Dashboard">
            
            <br/><br/>

            <Grid container style={{paddingBottom:"40px"}} justify="center">
              <Banner/>
            </Grid>

            <Grid container spacing={3} style={{paddingBottom:'30px'}}>
                <Grid item xs={12} md={8} lg={6}>
                  
                  {this.state.switch && 
                  <TextField
                    style={textField}
                    id="filled-read-only-input"
                    label="Read"
                    value={this.state.input + ' ' + this.state.partialResult}
                    InputProps={{
                      readOnly: true,
                    }}
                    variant="filled"
                    name="input"
                  />
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
                  <Switch
                    checked={this.state.switch}
                    onChange={this.handleChange}
                    value="checkedA"
                    name="switch"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                  />
                
                </Grid>
                {/* Recent Deposits */}
                <Grid item xs={12} md={4} lg={6}>

                  {this.state.switch && 
                  <Record
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
                <FormGroup row>
                  <FormControlLabel
                    control={<Checkbox checked={this.state.checkDialog} name="checkDialog" value="Dialogflow" onChange={this.handleCheck}/>}
                    label="Dialogflow"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={this.state.checkMICL} name="checkMICL" value="MICL" onChange={this.handleCheck}/>}
                    label="MICL"
                  />
                  
                  {/* <FormControlLabel
                    control={<Checkbox checked={this.state.checkDNN} name="checkDNN" value="DNN" onChange={this.handleCheck}/>}
                    label="DNN"
                  /> */}

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
                    disimilarityDNN = {this.state.disimilarityDNN}
                    loadingDNN = {this.state.loadingDNN}
                    responseDNN = {this.state.responseDNN}
                    choice = {this.state.choice}
                    handleChoice = {this.handleChoice}
                    reccommendation = {this.state.reccommendation}
                    scoreDNN = {this.state.scoreDNN}
                  />
                </Grid>
                } 
                
                {this.state.checkDialog &&
                <Grid item xs={12} md={4}>
                  <Dialogflow
                    similarityDialog = {this.state.similarityDialog}
                    disimilarityDialog = {this.state.disimilarityDialog}
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
                    disimilarityMICL = {this.state.disimilarityMICL}
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
                    disimilarityRajat = {this.state.disimilarityRajat}
                    loadingRajat = {this.state.loadingRajat}
                    responseRajat = {this.state.responseRajat}
                    scoreRajat = {this.state.scoreRajat}
                  />
                </Grid>
                }

                
            </Grid>

            </Tab>

            <Tab eventKey="chart" title="Chart">
            <br/><br/>
            <Grid container spacing={3} style={{paddingBottom:"40px"}}>
              <Grid item xs={12} md={6} lg={6}>
                <Charts responseScoreArray={this.state.responseScoreArray}/>
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