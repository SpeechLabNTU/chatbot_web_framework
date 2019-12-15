import './App.css';
import React, {Component} from 'react';
import {Navbar,Nav} from "react-bootstrap";
import Routes from './Routes';
import {BrowserRouter as Router} from 'react-router-dom';
import Dashboard from '../src/containers/Dashboard';

class App extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     audio: null
  //   };
  //   this.toggleMicrophone = this.toggleMicrophone.bind(this)
  // }

  // async getMicrophone() {
  //   const audio = await navigator.mediaDevices.getUserMedia({
  //     audio: true,
  //     video: false
  //   });
  //   this.setState({ audio });
  // }

  // stopMicrophone() {
  //   this.state.audio.getTracks().forEach(track => track.stop());
  //   this.setState({ audio: null });
  // }

  // toggleMicrophone() {
  //   if (this.state.audio) {
  //     this.stopMicrophone();
  //   } else {
  //     this.getMicrophone();
  //   }
  // }


  render(){

    return (

      <Dashboard/>

      // <div className="App">
      //   <main>
      //     <div className="controls">
      //       <button onClick={this.toggleMicrophone}>
      //         {this.state.audio ? 'Stop microphone' : 'Get microphone input'}
      //       </button>
      //     </div>
      //   </main>
      //   {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ''}
      // </div>
      
      // <div className="App">
      //   <Router>

      //   <Navbar bg="dark" variant="dark" sticky="top">
      //     <Navbar.Brand href="/compare">Baby Bonus FAQ</Navbar.Brand>
      //     <Nav className="mr-auto">
      //       {/* <Nav.Link href="/textDialog">Text Sending</Nav.Link>
      //       <Nav.Link href="/speechDialog">Speech Sending</Nav.Link>
      //       <Nav.Link href="/keyword">Keyword Detection</Nav.Link>
      //       <Nav.Link href="/intent">Intent Detection</Nav.Link> */}
      //       <Nav.Link href="/dashboard">Material Demo</Nav.Link>
      //     </Nav>
      //   </Navbar>

      //   <Routes/>

      //   </Router>

      // </div>
    );
  }

}


export default App;
