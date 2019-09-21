import '../App.css';
import axios from "axios";
import React, {Component} from 'react';
import {InputGroup,FormControl,Button} from "react-bootstrap";
import {Table} from "react-bootstrap";

class QnAMatching extends Component {

  constructor(props) {
    super(props);
    this.state = {
        isSubmitted:false,
        input:"",
        token:"",
        query:[],
        responses:[],
        apiResponse:"",
    }
    
    this.handleInput = this.handleInput.bind(this);
    this.submitToQA = this.submitToQA.bind(this);
  }

  submitToQA(){
    this.setState(prevState => ({
        query: [...prevState.query,this.state.input],
    }));

    var payload = {input: this.state.input}
    axios.post(`http://localhost:3001/api/matching`, payload)
    .then((res)=>{
        console.log(res)
        this.setState(prevState => ({
            responses: [...prevState.responses,res.data.queryResult.fulfillmentMessages[0].text.text[0]],
        }));
        this.setState({isSubmitted:true})
    })
    .catch((err)=>{
        console.log(err.response)
    });
    
  }

  handleInput(e) {
    e.preventDefault();
    let value = e.target.value;
    let name = e.target.name;
    this.setState({[name]:value})
  }

  render(){

    const answer = this.state.responses.map((item,key)=>
                        <div key={key+1}>
                          <h5 variant="info">{item}</h5>
                        </div>
                    ) 

    return (
      
        <header className="App-header">
        <h1>QA Matching</h1>
        <InputGroup className="mb-3" style={{width:"50%"}}>
          
          <FormControl name="input" onChange={this.handleInput}
            placeholder="Ask questions"
            aria-label="Ask questions"
            aria-describedby="basic-addon2"
          />

          <InputGroup.Append>
            <Button onClick={this.submitToQA} variant="outline-secondary">QnA Matching</Button>
          </InputGroup.Append>

        </InputGroup>


          {this.state.isSubmitted &&
            <Table striped bordered hover variant="dark" style={{width:"50%"}}>
            <thead>
              <tr>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{answer}</td>
              </tr>
            </tbody>
            </Table>
          }

    
        </header>
    );
  }

}


export default QnAMatching;
