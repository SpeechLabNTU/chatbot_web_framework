import './App.css';
import React, {Component} from 'react';
import {Navbar,Nav} from "react-bootstrap";
import Routes from './Routes';
import {BrowserRouter as Router} from 'react-router-dom';

class App extends Component {

  render(){

    return (
      
      <div className="App">

        <Router>

        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand href="/">Baby Bonus FAQ</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/textDialog">Text Sending</Nav.Link>
            <Nav.Link href="/speechDialog">Speech Sending</Nav.Link>
            <Nav.Link href="/keyword">Keyword Detection</Nav.Link>
            <Nav.Link href="/intent">Intent Detection</Nav.Link>
            <Nav.Link href="/compare">Comparison</Nav.Link>
          </Nav>
        </Navbar>

        <Routes/>

        </Router>

      </div>
    );
  }

}


export default App;
