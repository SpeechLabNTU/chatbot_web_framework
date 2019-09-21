import '../App.css';
import React, {Component} from 'react';
import io from 'socket.io-client'
import Record from '../Record'
import axios from 'axios';
import {InputGroup,FormControl,Button,Table} from 'react-bootstrap';

class SpeechDialog extends Component {

    constructor (props) {
        super(props)
        this.state = {
            mode: 'record',
            backendUrl: 'http://localhost:3001',
            isSocketReady: false,
            transcription: '',
            partialResult: '',
            status: 0, // 0: idle, 1: streaming, 2: finish
            isBusy: false,
            socket: null,
            isSubmitted:false,
            query:"",
            response:"",
            intent:"",
            apiResponse:""
        }
        this.handleClick = this.handleClick.bind(this);
        
      }
      
      handleClick(){
        
        this.setState({query:this.state.transcription})
        // this.setState(prevState => ({
        //   query: [...prevState.query,this.state.transcription],
        // }));
        const root_url = "https://dialogflow.googleapis.com/v2";
        const project_id = "chatbot-development-250810";
        const session_id = 6376876876;
        const URL = `${root_url}/projects/${project_id}/agent/sessions/${session_id}:detectIntent`;
        
        var config = {
          headers:{
              "Authorization": "Bearer " + this.state.dialogflowtoken,
              "Content-Type": "application/json"
          }
        };
    
        var text = this.state.transcription
        var bodyParameters = {
            "queryInput":{"text":{"text": text, "languageCode":"en"}},
        };
    
        axios.post(URL,bodyParameters,config)
            .then((res)=>{
              this.setState({response:res.data.queryResult.fulfillmentMessages[0].text.text[0]})
              this.setState({intent:res.data.queryResult.intent.displayName})
              // this.setState(prevState => ({
              //   responses: [...prevState.responses,res.data.queryResult.fulfillmentText],
              // }));
              this.setState({isSubmitted:true})
            })
            .catch((err)=>{
                console.log(err.response)
        });
        this.setState({transcription:''})
    
        console.log(this.state.responses)
    
      }

      componentDidMount () {
        this.initSockets()
      }
    
      initSockets () {
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
                transcription: prevState.transcription + ' ' + data.result.hypotheses[0].transcript,
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
    
      onTokenChange = (e) => {
        this.setState({
          token: e.target.value
        })
      }

      dialogflowtoken = (e) => {
        this.setState({
          dialogflowtoken: e.target.value
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
    
      render () {

        // const question = this.state.query.map((item,key)=>
        //                   <div key={key+1}>
        //                     <Badge variant="light">{item}</Badge>
        //                   </div>
        //               )  

        // const answer = this.state.responses.map((item,key)=>
        //                 <div key={key+1}>
        //                   <p variant="info">{item}</p>
        //                 </div>
        //             ) 
        return (
          <div className="container-fluid mt-5">
            <div className="row">
                <div className="col-md-5 offset-md-1">
                    <div className="token-input">
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Dialogflow token</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={this.dialogflowtoken} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">STT Token</label>
                        <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={this.onTokenChange} />
                    </div>
                    </div>
                    <div>
                        <Record
                        socket={this.state.socket}
                        isBusy={this.state.isBusy}
                        token={this.state.token}
                        isSocketReady={this.state.isSocketReady}
                        backendUrl={this.state.backendUrl}
                        reset={this.reset}
                        setBusy={this.setBusy}
                        /> 
                    </div>
                </div>

                <div className="col-md-4 offset-md-1">
                    <div className="form-group transcription">
                        <span className="is-finish">
                            <i className="fal fa-check" />
                        </span>

                        <InputGroup className="mb-3" style={{width:"100%"}}>
                            <FormControl
                                value={this.state.transcription + ' ' + this.state.partialResult}
                                readOnly
                                className={`form-control ${this.state.status === 2 ? 'success' : ''}`}
                                placeholder="Ask questions"
                                aria-label="Ask questions"
                                aria-describedby="basic-addon2"
                            />
                            <InputGroup.Append>
                                <Button onClick={this.handleClick} variant="outline-secondary">Submit</Button>
                            </InputGroup.Append>
                        </InputGroup>

                        {this.state.isSubmitted &&
                        <div>
                        <p>Intent Detected: {this.state.intent}</p>
                        <Table striped bordered hover variant="dark" style={{width:"100%"}}>
                        <thead>
                        <tr>
                            <th>{this.state.query}</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{this.state.response}</td>
                        </tr>
                        </tbody>
                        </Table>
                        </div>
            
                        }
            
                    </div>
                </div>


            </div>
          </div>
        )
      }

}


export default SpeechDialog;
