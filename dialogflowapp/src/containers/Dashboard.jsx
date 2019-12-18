import React,{Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
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
import CircularProgress from '@material-ui/core/CircularProgress';

// function Copyright() {
//   return (
//     <Typography variant="body2" color="textSecondary" align="center">
//       {'Copyright © '}
//       <Link color="inherit" href="https://material-ui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

const root={flexgrow: 1};
const content={flexgrow: 1, height: '100vh', overflow:'auto'};
const container={paddingTop: '50px', paddingBottom:'10px'};
const textField={width:'595px'};
const textFieldOutput={width:'300px'};
const textPosition ={paddingLeft: '10px', paddingTop:'10px', paddingBottom:'10px'};

class Dashboard extends Component{

  constructor(props) {
    super(props);
    this.state = {
        //Direct Query
        isSubmitted:false,
        input:"",
        query:"",
        response:"",
        responseJamie:"",
        responseRephrased: "",
        responseBp: "",
        apiResponse:"",
        loading:false,
        loadingJamie:false,
        tokenActive:false,

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
    this.summarizer = this.summarizer.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  summarizer(result){
    var array = []
    var summary = "";
    array = result.split(" ")
    if (array.length < 10){
      summary = result
    }else{
      for (var i = 0;i<10;i++){
        if (i === 9){
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
  
  async handleClick(){
    
    this.setState({query: this.state.input})
    var params = {
      question: this.state.input
    }

    this.setState({loading:true})
    this.setState({loadingJamie:true})
    await axios.post("http://localhost:3001/api/dialogflow", params)
        .then((res)=>{
            var summarized_1 = this.summarizer(res.data.reply)
            this.setState({response:summarized_1})
            this.setState({loading:false})
            // this.setState({isSubmitted:true})
        });
    
    await axios.post('http://localhost:3001/api/askJamieFast', params)
        .then((res)=>{
            var summarized_2 = this.summarizer(res.data.reply)
            this.setState({responseJamie:summarized_2})
            this.setState({loadingJamie:false})
    });
    
    this.setState({input:''})
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
        <AppBar position="static" style={root}>
            <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
            >
                <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
                NTU Baby Bonus FAQ
            </Typography>
            
            </Toolbar>
        </AppBar>
        
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
                  token= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkNzBjYmE2ZjBkNmUzMDAxYzFlNjViOSIsImlhdCI6MTU3NTUxMTY1OSwiZXhwIjoxNTc4MTAzNjU5fQ.325tpPfG07dtqgJpHvGsyKB_p1YKwOqxOQMUrI3b5ws"
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
                
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
                <TextField
                  id="outlined-multiline-static"
                  label="Andrew QA \w Dialogflow"
                  multiline
                  rows="10"
                  variant="filled"
                  InputProps={{
                    readOnly: true,
                  }}
                  style={textFieldOutput}
                  value={this.state.loading ? "loading..." : this.state.response}
                />
                </Grid>
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={3}>
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
            {/* <Box pt={4}>
                <Copyright />
            </Box> */}
            </Container>
        </main>
      </div>
    );
  }
}

export default Dashboard