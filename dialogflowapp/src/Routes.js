import React from "react";
import {Switch, Route} from 'react-router-dom';
import textdialog from "./containers/TextDialog";
import speechDialog from "./containers/SpeechDialog";
import comparison from "./containers/Comparison";
import prompt from "./containers/Prompt";

export default ({childProps})=>

<Switch>
    <Route path="/" exact component={textdialog} props={childProps}/>
    <Route path="/textDialog" exact component={textdialog} props={childProps}/>
    <Route path="/speechDialog" exact component={speechDialog} props={childProps}/>
    <Route path="/comparison" exact component={comparison} props={childProps}/>
    <Route path="/prompt" exact component={prompt} props={childProps}/>
</Switch>;
