import './App.css';
import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from '../src/containers/Dashboard';
import Main from './interfaceComponents/Main';

class App extends Component {

  render(){
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" component={Dashboard} exact />
          <Route path="/FAQ" component={Main} exact />
        </Switch>
      </BrowserRouter>
    );
  }

}
export default App;
