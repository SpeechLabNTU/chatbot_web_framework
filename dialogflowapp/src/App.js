import './App.css';
import React, {Component} from 'react';
import {Navbar,Nav} from "react-bootstrap";
import Routes from './Routes';
import {BrowserRouter as Router} from 'react-router-dom';
import Dashboard from '../src/containers/Dashboard';

class App extends Component {

  render(){

    return (

      <Dashboard/>

    );
  }

}


export default App;
