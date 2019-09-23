import React from "react";
import {Switch, Route} from 'react-router-dom';
import textdialog from "./containers/TextDialog";
import speechDialog from "./containers/SpeechDialog";
import keyword from "./containers/KeywordDetection";
import intent from "./containers/IntentDetection";
import compare from "./containers/Comparison";

export default ({childProps})=>

<Switch>
    <Route path="/" exact component={textdialog} props={childProps}/>
    <Route path="/textDialog" exact component={textdialog} props={childProps}/>
    <Route path="/speechDialog" exact component={speechDialog} props={childProps}/>
    <Route path="/keyword" exact component={keyword} props={childProps}/>
    <Route path="/intent" exact component={intent} props={childProps}/>
    <Route path="/compare" exact component={compare} props={childProps}/>
</Switch>;
