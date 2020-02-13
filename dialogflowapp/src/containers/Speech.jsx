import React,{Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Record from '../Record';
import io from 'socket.io-client'

const textPosition ={paddingLeft: '10px', paddingTop:'10px', paddingBottom:'10px'};

class Speech extends Component{

  constructor(props) {
    super(props);
    this.state = {
        //Speech to Text
        audioEnable: false,
        mode: 'record',
        backendUrl: 'http://localhost:3001',
        isSocketReady: false,
        partialResult: '',
        status: 0, // 0: idle, 1: streaming, 2: finish
        isBusy: false,
        socket: null,
    }
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
        {this.props.switch && 
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
        
        {this.props.switch ===false &&
        <Paper style={textPosition}>
        <Typography variant="h5" component="h3">Speech to Text Disabled. </Typography>
        <Typography component="p">Select switch to enable speech</Typography>
        </Paper>
        }   
                
      </div>
    );
  }
}

export default Speech