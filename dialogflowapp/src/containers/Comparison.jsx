import '../App.css';
import axios from "axios";
import React, {Component} from 'react';
import {InputGroup,FormControl,Button} from "react-bootstrap";
import io from 'socket.io-client'
import {Table} from "react-bootstrap";
import loading from '../img/Rolling.gif';
import Record from '../Record';

class Comparison extends Component {

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
        socket: null
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.summarizer = this.summarizer.bind(this);
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
            // this.handleClick()

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

  summarizer(result){
    var array = []
    var summary = "";
    array = result.split(" ")
    for (var i = 0;i<7;i++){
      if (i === 6){
        summary += array[i] + "..."
      }else{
        summary += array[i] + " "
      }
    }
    return summary
    
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
            this.setState({isSubmitted:true})
        });
    
    await axios.post('http://localhost:3001/api/askJamieFast', params)
        .then((res)=>{
            var summarized_2 = this.summarizer(res.data.reply)
            this.setState({responseJamie:summarized_2})
            this.setState({loadingJamie:false})
    });

    await axios.post('http://localhost:3001/api/directQueryRephrased', params)
        .then((res)=>{
            console.log(res.data)
            var summarized_3 = this.summarizer(res.data.reply)
            this.setState({responseRephrased:summarized_3})
            this.setState({loadingJamie:false})
    });

    await axios.post('http://localhost:3001/api/directQueryBp', params)
        .then((res)=>{
            console.log(res.data)
            var summarized_4 = this.summarizer(res.data.reply)
            this.setState({responseBp:summarized_4})
            this.setState({loadingJamie:false})
    });
    this.setState({input:''})
  }

  handleInput(e) {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({[name]:value})
  }

  render(){

    return (
        // <header className="App-header"> 

        <div className="container-fluid">
          {/* <div className="row"> */}
            {/* <div className="col-md-5 offset-md-1">
            <h1>QA Comparison</h1>
              <InputGroup className="mb-3" style={{width:"100%"}}>

                <FormControl name="input" onChange={this.handleInput}
                  placeholder="Ask questions"
                  aria-label="Ask questions"
                  aria-describedby="basic-addon2"
                />

                <InputGroup.Append>
                  <Button onClick={this.handleClick} variant="outline-secondary">Submit</Button>
                </InputGroup.Append>

              </InputGroup>
              
            </div> */}

            {/* <div className="col-md-5"> */}
               <FormControl name="input"
                    readOnly
                    value={this.state.input + ' ' + this.state.partialResult}
                    placeholder="Speech Input"
                    aria-label="Ask questions"
                    aria-describedby="basic-addon2"
                />
                
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
                              
              {/* </div>

          </div> */}

          {/* <div className="row">

              {this.state.isSubmitted &&
                  <div>
                    <div className="row">
                      <div className="col-md-5 offset-md-1">
                        <p>Andrew QA Dialogflow</p>
                        <Table striped bordered hover variant="dark" style={{width:"550px"}}>
                            <thead>
                                <tr>
                                <th><h5>{this.state.query}</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                {this.state.loading && <td><img style={{width:'30px',height:'30px'}} className="response" src={loading} alt="load"/></td>}
                                {this.state.loading === false && <td><h5>{this.state.response}</h5></td>}
                                </tr>
                            </tbody>
                        </Table>
                      </div>

                      <div className="col-md-5 offset-md-1">
                        <p>Ask Jamie</p>
                        <Table striped bordered hover variant="dark" style={{width:"550px"}}>
                            <thead>
                                <tr>
                                <th><h5>{this.state.query}</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                {this.state.loadingJamie && <td><img style={{width:'30px',height:'30px'}} className="response" src={loading} alt="load"/></td>}
                                {this.state.loadingJamie === false && <td><h5>{this.state.responseJamie}</h5></td>}
                                </tr>
                            </tbody>
                        </Table>
                      </div>
                    </div>

                    <div className="row">

                      <div className="col-md-5 offset-md-1">
                      <p>Andrew QA Rephrased</p>
                      <Table striped bordered hover variant="dark" style={{width:"550px"}}>
                            <thead>
                                <tr>
                                <th><h5>{this.state.query}</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                {this.state.loading && <td><img style={{width:'30px',height:'30px'}} className="response" src={loading} alt="load"/></td>}
                                {this.state.loading === false && <td><h5>{this.state.responseRephrased}</h5></td>}
                                </tr>
                            </tbody>
                        </Table>
                      </div>

                      <div className="col-md-5 offset-md-1">
                      <p>Andrew QA Bp</p>
                      <Table striped bordered hover variant="dark" style={{width:"550px"}}>
                            <thead>
                                <tr>
                                <th><h5>{this.state.query}</h5></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                {this.state.loading && <td><img style={{width:'30px',height:'30px'}} className="response" src={loading} alt="load"/></td>}
                                {this.state.loading === false && <td><h5>{this.state.responseBp}</h5></td>}
                                </tr>
                            </tbody>
                      </Table>
                      </div>
                    </div>

                      
                  </div>
            }
              
            </div> */}


        </div>
        // </header> 
    );
  }

}


export default Comparison;
