import React,{Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const root={flexgrow: 1};
const content={flexgrow: 1, height: '100vh', overflow:'auto'};
const container={paddingTop: '50px', paddingBottom:'10px'};
const textField={width:'595px'};
const textFieldOutput={width:'400px'};
const textFieldsuccess={width:'400px',border:'1px solid #00ff00'};
const textFielderror={width:'400px',border:'1px solid #ff0000'};
const textPosition ={paddingLeft: '10px', paddingTop:'10px', paddingBottom:'10px'};
const form={width:'400px'};

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
        responseRephrased: "",
        responseBp: "",
        apiResponse:"",
        loadingDialogflow:false,
        loadingDNN: false,
        loadingJamie:false,
        tokenActive:false,
        comparisonJamie: false,
        comparisonDialog: false,
        comparisonDNN: false,
        thresholdJamie: 0,
        similarityDialog: false,
        disimilarityDialog: false,
        similarityDNN: false,
        disimilarityDNN: false,
        choice: "",
        reccommendation: [],

        //Speech to Text
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
    this.handleClick = this.handleClick.bind(this);
    this.handleChoice = this.handleChoice.bind(this);
    this.summarizer = this.summarizer.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.checkSimilarityDNN = this.checkSimilarityDNN.bind(this);
    this.checkSimilarityDialog = this.checkSimilarityDialog.bind(this);
    this.APICallResponseCompare = this.APICallResponseCompare.bind(this);
    
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
            callback(probability)
            
        });
  }

  checkSimilarityDNN(score){
    if (score < 0.4){
      this.setState({similarityDNN:false})
      this.setState({disimilarityDNN: true})
    }else{
      this.setState({similarityDNN:true})
      this.setState({disimilarityDNN:false})
    }
  }

  checkSimilarityDialog(score){
    if (score < 0.4){
      this.setState({similarityDialog:false})
      this.setState({disimilarityDialog: true})

    }else{
      this.setState({similarityDialog:true})
      this.setState({disimilarityDialog:false})
    }
  }


  async handleClick(){
    
    this.setState({query: this.state.input})
    var params = {
      question: this.state.input
    }

    this.setState({loadingDialogflow:true})
    this.setState({loadingDNN:true})
    this.setState({loadingJamie:true})
    
    await axios.post('http://localhost:3001/jamie/api/askJamieFast', params)
        .then((res)=>{
          if(res.status === 200){
            var summarized_2 = this.summarizer(res.data.reply)
            this.setState({responseJamie:summarized_2})
            this.setState({loadingJamie:false})
            this.setState({comparisonJamie:true})
          }else{
            console.log("Ask Jamie Error")
          }
            
    });

    await axios.post("http://localhost:3001/flask/api/russ_query", params)
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
    })


    await axios.post("http://localhost:3001/dialog/api/dialogflow", params)
        .then((res)=>{

          if(res.status === 200){
            var summarized_1 = this.summarizer(res.data.reply)
            this.setState({responseDialogflow:summarized_1})
            this.setState({loadingDialogflow:false})
            this.setState({comparisonDialog:true})
          }else{
            console.log("Dialogflow Error")
          }
            
    });

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
  }

  handleChoice(e){
    e.preventDefault();
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

  handleChange(e) {
    e.preventDefault();
    let name = e.target.name;
    this.setState({[name]:e.target.checked})
  }

  componentDidMount () {
    this.initSockets()
  }

  initSockets() {
    const socket = io(this.state.backendUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity
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
        {/* <AppBar position="static" style={root}>
            <Toolbar>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
                NTU Baby Bonus FAQ
            </Typography>
            
            </Toolbar>
        </AppBar> */}
        
        <main style={content}>
            <Container maxWidth="lg" style={container}>
            <Grid container spacing={3}>
                {/* Chart */}
                <Grid item xs={12} md={8} lg={6}>
                  
                  {this.state.switch && 
                  <TextField
                    style={textField}
                    id="filled-read-only-input"
                    label="Read Only"
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
                  token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzBjYmE2ZjBkNmUzMDAxYzFlNjViOSIsImlhdCI6MTU4MTU1OTA1MiwiZXhwIjoxNTg0MTUxMDUyfQ.WEDXHrcPfCfM7hHaFB7Oj5shOnQRQyu2RcN1xwLGrVw"
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
                
                <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-multiline-static"
                  label="Feed Forward Neural Network"
                  multiline
                  rows="10"
                  variant="filled"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={this.state.similarityDNN ? textFieldsuccess: this.state.disimilarityDNN ? textFielderror: textFieldOutput}
                  value={this.state.loadingDNN ? "loading..." : this.state.responseDNN} 
                />
                <FormControl variant="outlined" style={form}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.choice}
                    onChange={this.handleChoice}
                    name="choice"
                  >
                    <MenuItem disabled value="recommended questions">--Recommended Questions--</MenuItem>
                    {this.state.reccommendation.map((options,i)=>{
                        return(
                        <MenuItem key={i} value={options.question}>{options.question}</MenuItem>
                        );
                    }) 

                    }
                    
                  </Select>
                </FormControl>
                  
                </Grid>

                <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-multiline-static"
                  label="Ask Jamie"
                  multiline
                  rows="10"
                  variant="filled"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={textFieldOutput}
                  value={this.state.loadingJamie ? "loading..." : this.state.responseJamie} 
                />
                </Grid>

                <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-multiline-static"
                  label="Dialogflow"
                  multiline
                  rows="10"
                  variant="filled"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={this.state.similarityDialog ? textFieldsuccess: this.state.disimilarityDialog ? textFielderror: textFieldOutput} 
                  value={this.state.loadingDialogflow ? "loading...": this.state.responseDialogflow}
                />
                </Grid>

                <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-multiline-static"
                  label="Andrew QA \w Dialogflow"
                  multiline
                  rows="10"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={textFieldOutput}
                  // value={this.state.loading ? "loading..." : this.state.response}
                />

                </Grid>
                <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-multiline-static"
                  label="Andrew QA Rephrased"
                  multiline
                  rows="10"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={textFieldOutput}
                />
                </Grid>
                <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-multiline-static"
                  label="Andrew QA Bp"
                  multiline
                  rows="10"
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={textFieldOutput}
                />
                </Grid>
                
            </Grid>
            
            </Container>
        </main>
      </div>
    );
  }
}

export default Dashboard