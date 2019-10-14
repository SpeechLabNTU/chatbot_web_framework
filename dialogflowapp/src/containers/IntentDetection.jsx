import '../App.css';
import axios from "axios";
import React, {Component} from 'react';
import {InputGroup,FormControl,Button} from "react-bootstrap";
import {Table} from "react-bootstrap";

class IntentDetection extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isSubmitted:false,
        input:"",
        token:"",
        query:"",
        response:"",
        intent:"",
        apiResponse:"",
        tokenActive:false
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.determineQueryType = this.determineQueryType.bind(this);
  }

  determineQueryType(responseObj){
    this.setState({query:responseObj.queryText})
  }

  handleClick(){
    
    const root_url = "https://dialogflow.googleapis.com/v2";
    const project_id = "chatbot-development-250810";
    const session_id = 6376876876;
    const URL = `${root_url}/projects/${project_id}/agent/sessions/${session_id}:detectIntent`;
    
    var config = {
      headers:{
          "Authorization": "Bearer " + this.state.token,
          "Content-Type": "application/json"
      }
    };

    var text = this.state.input
    var bodyParameters = {
        "queryInput":{"text":{"text": text, "languageCode":"en"}},
    };

    axios.post(URL,bodyParameters,config)
        .then((res)=>{
          console.log(res.data.queryResult)
          this.setState({response:res.data.queryResult.fulfillmentMessages[0].text.text[0]})
          this.setState({intent:res.data.queryResult.intent.displayName})
          this.determineQueryType(res.data.queryResult)
          this.setState({isSubmitted:true})
        })
        .catch((err)=>{
            console.log(err.response)
    });

    console.log(this.state.responses)

  }

  handleInput(e) {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({[name]:value})
  }

  render(){

    return (
      
        <header className="App-header">
        <h1>Intent detection</h1>
        <InputGroup className="mb-3" style={{width:"50%"}}>
          <FormControl name="token" onChange={this.handleInput}
            placeholder="Enter Dialogflow Token"
            aria-label="Enter Dialogflow Token"
            aria-describedby="basic-addon2"
          />
          {this.state.token === "" 
          ?(<FormControl name="input"
            disabled
            placeholder="Ask questions"
            aria-label="Ask questions"
            aria-describedby="basic-addon2"
          />):
          <FormControl name="input" onChange={this.handleInput}
            placeholder="Ask questions"
            aria-label="Ask questions"
            aria-describedby="basic-addon2"
          />
          }

          <InputGroup.Append>
            <Button onClick={this.handleClick} variant="outline-secondary">Submit</Button>
          </InputGroup.Append>

        </InputGroup>


          {this.state.isSubmitted &&

                <div>
                    <p>Intent Detected: {this.state.intent}</p>
                    <Table striped bordered hover variant="dark" style={{width:"50%", marginLeft:"auto", marginRight:"auto"}}>
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

    
        </header>
    );
  }

}


export default IntentDetection;
