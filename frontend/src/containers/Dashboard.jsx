import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from "axios";

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import Collapse from '@material-ui/core/Collapse';

import Record from '../Record';
import Jamie from "./Jamie";
import AnswerModel from "./AnswerModel";
import UploadBox from "./UploadBox";
import AudioUpload from "./Audiofile";
import TopicSelection from "./TopicSelection";
import TabPanel from "./TabPanel"

import AISG from "../img/aisg.png";
import MSF from "../img/msf.png";
import NTU from "../img/ntu.png";
import NUS from "../img/nus.png";

import ReactTab from "react-bootstrap/Tab"
import ReactTabs from "react-bootstrap/Tabs"

const useStyles = makeStyles( theme => ({
  logosGrid: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  descriptionCardGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}))

export default function Dashboard(props) {

  const classes = useStyles()
  const theme = useTheme()

  const backendURL = process.env.REACT_APP_API

  const [input, setInput] = React.useState("")
  const [similarQuestions, setSimilarQuestions] = React.useState(null)
  const [topic, setTopic] = React.useState("Baby Bonus")
  const [inputMethod, setInputMethod] = React.useState(0)

  ////////// various chatbot state variables
  const [chatbotMenuRef, setChatbotMenuRef] = React.useState(null)
  const [responseJamie, setResponseJamie] = React.useState("")
  const [loadingJamie, setLoadingJamie] = React.useState(false)

  const [responseDialog, setResponseDialog] = React.useState("")
  const [loadingDialog, setLoadingDialog] = React.useState(false)
  const [scoreDialog, setScoreDialog] = React.useState(null)
  const [checkDialog, setCheckDialog] = React.useState(true)
  const [availableDialog, setAvailableDialog] = React.useState(true)

  const [responseMICL, setResponseMICL] = React.useState("")
  const [loadingMICL, setLoadingMICL] = React.useState(false)
  const [scoreMICL, setScoreMICL] = React.useState(null)
  const [checkMICL, setCheckMICL] = React.useState(true)
  const [availableMICL, setAvailableMICL] = React.useState(true)

  const [responseRajat, setResponseRajat] = React.useState("")
  const [loadingRajat, setLoadingRajat] = React.useState(false)
  const [scoreRajat, setScoreRajat] = React.useState(null)
  const [checkRajat, setCheckRajat] = React.useState(true)
  const [availableRajat, setAvailableRajat] = React.useState(true)

  const [responseRushi, setResponseRushi] = React.useState("")
  const [loadingRushi, setLoadingRushi] = React.useState(false)
  const [scoreRushi, setScoreRushi] = React.useState(null)
  const [checkRushi, setCheckRushi] = React.useState(true)
  const [availableRushi, setAvailableRushi] = React.useState(true)

  // when topic changes
  React.useEffect( () => {
    resetResponses()

    switch (topic) {
      case "Baby Bonus":
        setAvailableDialog(true)
        setCheckDialog(true)
        setAvailableMICL(true)
        setCheckMICL(true)
        setAvailableRajat(true)
        setCheckRajat(true)
        setAvailableRushi(true)
        setCheckRushi(true)
        break
      case "Covid 19":
        setAvailableDialog(true)
        setCheckDialog(true)
        setAvailableMICL(false)
        setCheckMICL(false)
        setAvailableRajat(true)
        setCheckRajat(true)
        setAvailableRushi(true)
        setCheckRushi(true)
        break
      case "ComCare":
        setAvailableDialog(false)
        setCheckDialog(false)
        setAvailableMICL(false)
        setCheckMICL(false)
        setAvailableRajat(false)
        setCheckRajat(false)
        setAvailableRushi(true)
        setCheckRushi(true)
        break
      case "Adoption":
        setAvailableDialog(false)
        setCheckDialog(false)
        setAvailableMICL(false)
        setCheckMICL(false)
        setAvailableRajat(false)
        setCheckRajat(false)
        setAvailableRushi(true)
        setCheckRushi(true)
        break
      default:
        break
    }
  }, [topic])

  React.useEffect( () => {
    setInput("")
    resetResponses()
  }, [inputMethod])

  // API calls for various chatbots
  const askJamieAPI = params => {
    return new Promise( (resolve,reject) => {
      axios.post(`${process.env.REACT_APP_API}/jamie/api/askJamieFast`, params)
      .then((res)=>{
        resolve(res.data.reply)
      })
      .catch(error=>{
          console.log("Error contacting Ask Jamie")
      });
    })
  }

  const dialogAPI = params => {
    return new Promise( (resolve,reject) => {
      axios.post(`${process.env.REACT_APP_API}/dialog/api/dialogflow`, params)
      .then((res)=>{
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Dialogflow")
      });
    })
  }

  const miclAPI = params => {
    return new Promise( (resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/micl/api/directQuery`, params)
      .then((res)=>{
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting MICL server")
      })
    })
  }

  const rajatAPI = params => {
    return new Promise( (resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/rajat/api/queryEndpoint`, params)
      .then((res)=>{
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Rajat server")
      })
    })
  }

  const rushiAPI = params => {
    return new Promise( (resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/rushi/api/queryEndpoint`, params)
      .then((res)=>{
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Rushi server")
      })
    })
  }

  const rushiAPIwithSimilarQuestions = params => {
    return new Promise( (resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/rushi/api/queryEndpoint`, params)
      .then((res)=>{
        setSimilarQuestions(res.data.similarQuestions)
        resolve(res.data.reply)
      })
      .catch(error=>{
        console.log("Error contacting Rushi server")
      })
    })
  }

  // for response comparisons
  const makeResponseComparisonRequest = (req) => {
    return new Promise( (resolve, reject) => {
      axios.post(`${process.env.REACT_APP_API}/flask/api/responseCompare`, req)
      .then((res)=>{
        let probability = res.data.reply
        if (probability !== -1){
          resolve(probability)
        }
      }).catch(error=>{
        reject("Error Contacting API server")
        console.log("Error Contacting API server")
      })
    })
  }

  const makeComparisons = () => {
    let temp = [
      [checkDialog, responseDialog, setScoreDialog],
      [checkMICL, responseMICL, setScoreMICL],
      [checkRajat, responseRajat, setScoreRajat],
      [checkRushi, responseRushi, setScoreRushi]
    ]
    temp.forEach( ([check, response, setScore]) => {
      if (check) {
        let req = {responses: [response, responseJamie]}
        makeResponseComparisonRequest(req)
        .then( val => {setScore(val)})
        .catch( e => {
          console.log(e)
        })
      }
    })
  }

  // starting point of user text/speech input
  const getResponses = (value) => {
    if (value.trim() === "") return

    // reset scores
    resetResponses()

    var params = {
      "question": value,
      "topic": topic,
    }

    var promiseArray = []
    setLoadingJamie(true)
    var askJamiePromise = askJamieAPI(params)
    promiseArray.push(askJamiePromise)

    askJamiePromise.then( res => {
      setResponseJamie(res)
      setLoadingJamie(false)
    })

    let temp = [
      [checkDialog, dialogAPI, setLoadingDialog, setResponseDialog],
      [checkMICL, miclAPI, setLoadingMICL, setResponseMICL],
      [checkRajat, rajatAPI, setLoadingRajat, setResponseRajat],
      [checkRushi, rushiAPIwithSimilarQuestions, setLoadingRushi, setResponseRushi]
    ]

    temp.forEach( ([check, apiCall, setLoading, setResponse]) => {
      if (check) {
        setLoading(true)
        var promise = apiCall(params)
        promiseArray.push(promise)

        promise.then( res => {
          setResponse(res)
          setLoading(false)
        })
      }
    })

    Promise.all(promiseArray)
    .then( values => {
      // console.log(values)
      makeComparisons()
    })
  }

  const resetResponses = () => {
    setSimilarQuestions(null)

    setResponseJamie("")
    setResponseDialog("")
    setResponseMICL("")
    setResponseRajat("")
    setResponseRushi("")

    setScoreDialog(null)
    setScoreMICL(null)
    setScoreRajat(null)
    setScoreRushi(null)
  }


  return (
    <React.Fragment>
    <CssBaseline />
      <Container maxWidth="lg" style={{paddingBottom:theme.spacing(6)}}>

        {/* Top Banner of Logos */}
        <Grid container className={classes.logosGrid} spacing={3}>
          <Grid item xs={6} md={3} container justify="center">
            <img src={AISG} style={{width: '80px', height:'70px'}} alt="AISG Logo"/>
          </Grid>
          <Grid item xs={6} md={3} container justify="center">
            <img src={NTU} style={{width: '160px', height:'70px'}} alt="NTU Logo"/>
          </Grid>
          <Grid item xs={6} md={3} container justify="center">
            <img src={NUS} style={{width: '160px', height:'70px'}} alt="NUS Logo"/>
          </Grid>
          <Grid item xs={6} md={3} container justify="center">
            <img src={MSF} style={{width: '140px', height:'70px'}} alt="MSF Logo"/>
          </Grid>

        </Grid>

        <ReactTabs defaultActiveKey="dashboard" id="uncontrolled-tab-example">

        {/* Multi-Chatbot Interface */}
        <ReactTab eventKey="dashboard" title="Multi-Chatbot Interface">
          {/* Description Card */}
          <Grid container className={classes.descriptionCardGrid} justify="center">
            <Card style={{paddingRight:10}}>
              <CardContent >
                <Typography color="textSecondary" gutterBottom>
                  Multi Chatbot Interface for Response Comparisons
                </Typography>
                <Typography variant="body2">
                  1. Choose between Text or Realtime Speech Input<br />
                  2. Selection of Question Topic and Chatbot Services<br />
                  3. Real-time Speech allows choice of Google or AISG Transcription Services
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* The rest of the main interface */}
          <Grid container spacing={3}>

            {/* Tabs and User Inputs */}
            <Grid item container xs={12}>

              <Grid item>
                <Paper>
                  <Tabs
                    orientation="vertical"
                    variant="fullWidth"
                    value={inputMethod}
                    onChange={(e, newValue)=>{setInputMethod(newValue)}}
                  >
                    <Tab label="Text" />
                    <Tab label="Speech" />
                  </Tabs>
                </Paper>
              </Grid>

              <Grid item style={{flexGrow: 1, maxWidth:700}}>

                {/* User Input (Text or Speech) */}
                <Paper>
                  {/* Text input */}
                  <TabPanel value={inputMethod} index={0}>
                    <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-amount">Input</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={<InputAdornment position="start">FAQ</InputAdornment>}
                      labelWidth={60}
                      multiline
                      name="input"
                      value={input}
                      onChange={(e)=>{setInput(e.target.value)}}
                    />
                    <Button onClick={()=>{getResponses(input)}} variant="contained" color="primary">Submit</Button>
                    </FormControl>
                  </TabPanel>
                  {/* Speech to text */}
                  <TabPanel value={inputMethod} index={1}>
                    <Record
                    input = {input}
                    setInput = {setInput}
                    backendURL={backendURL}
                    resetResponses={resetResponses}
                    getResponses={getResponses}
                    />
                    <br/>
                    <Typography variant='h6'>Transcription: {input}</Typography>
                  </TabPanel>
                </Paper>

                {/* Suggested Questions drop down menu */}
                <Collapse in={similarQuestions!==null}>
                  <Paper style={{marginTop:3}}>
                    <List dense>
                      <ListItem><Typography variant='h6'>You might be interested: </Typography></ListItem>
                      {similarQuestions && similarQuestions.map( (item) => {
                        if (item !== input) return (
                          <ListItem button onClick={(e)=>{
                            setInput(e.target.innerText)
                            getResponses(e.target.innerText)
                          }}
                          >{item}</ListItem>
                        )
                        else return null
                      })}
                    </List>
                  </Paper>
                </Collapse>
              </Grid>
            </Grid>

            {/* Question topic and Chatbot services */}
            <Grid item container xs={12} spacing={1}>

              <Grid item>
                <TopicSelection
                topic = {topic}
                setTopic = {setTopic}
                />
              </Grid>

              <Grid item><Paper elevation={1}><List component="nav">
              <ListItem button onClick={(event)=>{setChatbotMenuRef(event.currentTarget)}}>
              <ListItemText primary="Chatbot Services" secondary={
                (checkDialog ? "Dialogflow " : "") +
                (checkMICL ? "Andrew " : "") +
                (checkRajat ? "Rajat " : "") +
                (checkRushi ? "Rushi " : "")
              } />
              </ListItem>
              </List></Paper>
              <Menu
                anchorEl={chatbotMenuRef}
                keepMounted
                open={Boolean(chatbotMenuRef)}
                onClose={()=>{setChatbotMenuRef(null)}}
              >
              {availableDialog &&
              <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
              Dialogflow
              <Checkbox checked={checkDialog} name="checkDialog" value="Dialogflow"
              onChange={(e) => {
                setCheckDialog(e.target.checked)
                if (!e.target.checked) setResponseDialog("")
              }}/>
              </MenuItem> }
              {availableMICL &&
              <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
              Andrew
              <Checkbox checked={checkMICL} name="checkMICL" value="MICL"
              onChange={(e) => {
                setCheckMICL(e.target.checked)
                if (!e.target.checked) setResponseMICL("")
              }}/>
              </MenuItem> }
              {availableRajat &&
              <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
              Rajat
              <Checkbox checked={checkRajat} name="checkRajat" value="Rajat"
              onChange={(e) => {
                setCheckRajat(e.target.checked)
                if (!e.target.checked) setResponseRajat("")
              }}/>
              </MenuItem> }
              {availableRushi &&
              <MenuItem style={{display:'flex', justifyContent: "space-between"}}>
              Rushi
              <Checkbox checked={checkRushi} name="checkRushi" value="Rushi"
              onChange={(e) => {
                setCheckRushi(e.target.checked)
                if (!e.target.checked) setResponseRushi("")
              }}/>
              </MenuItem> }
              </Menu></Grid>

            </Grid>

            {/* below are the various chatbots */}
            <Grid item xs={12} sm={6} md={4}>
              <Jamie
                loadingJamie = {loadingJamie}
                responseJamie = {responseJamie}
              />
            </Grid>

            {checkDialog &&
            <Grid item xs={12} sm={6} md={4}>
              <AnswerModel
                value = "Dialogflow"
                loading = {loadingDialog}
                response = {responseDialog}
                score = {scoreDialog}
              />
            </Grid>
            }

            {checkMICL &&
            <Grid item xs={12} sm={6} md={4}>
              <AnswerModel
                value = "Andrew"
                loading = {loadingMICL}
                response = {responseMICL}
                score = {scoreMICL}
              />
            </Grid>
            }

            {checkRajat &&
            <Grid item xs={12} sm={6} md={4}>
              <AnswerModel
                value = "Rajat"
                loading = {loadingRajat}
                response = {responseRajat}
                score = {scoreRajat}
              />
            </Grid>
            }

            {checkRushi &&
            <Grid item xs={12} sm={6} md={4}>
              <AnswerModel
                value="Rushi"
                loading={loadingRushi}
                response={responseRushi}
                score={scoreRushi}
              />
            </Grid>
            }

          </Grid>

        </ReactTab>

        {/* Performance Analysis */}
        <ReactTab eventKey="chart" title="Performance Analysis">
          <UploadBox
          askJamieAPI={askJamieAPI}
          dialogflowAPI={dialogAPI}
          miclAPI={miclAPI}
          rajatAPI={rajatAPI}
          rushiAPI={rushiAPI}
          />
        </ReactTab>

        {/* Transcription Comparison */}
        <ReactTab eventKey="audio" title="Transcription Comparison">
          <AudioUpload
          backendUrl={backendURL}
          />
        </ReactTab>
        </ReactTabs>

      </Container>
    </React.Fragment>
  )
}
