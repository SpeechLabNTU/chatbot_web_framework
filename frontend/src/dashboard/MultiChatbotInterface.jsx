import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
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
import Jamie from "./components/Jamie";
import AnswerModel from "./components/AnswerModel";
import TopicSelection from "./components/TopicSelection";
import TabPanel from "./components/TabPanel"

const useStyles = makeStyles(theme => ({
  descriptionCardGrid: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}))

export default function MultiChatbotInterface(props) {

  const classes = useStyles()

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

  const [responseBani, setResponseBani] = React.useState("")
  const [loadingBani, setLoadingBani] = React.useState(false)
  const [scoreBani, setScoreBani] = React.useState(null)
  const [checkBani, setCheckBani] = React.useState(true)
  const [availableBani, setAvailableBani] = React.useState(true)

  // when topic changes
  React.useEffect(() => {
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
        setAvailableBani(true)
        setCheckBani(true)
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
        setAvailableBani(true)
        setCheckBani(true)
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
        setAvailableBani(true)
        setCheckBani(true)
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
        setAvailableBani(true)
        setCheckBani(true)
        break
      default:
        break
    }
  }, [topic])

  React.useEffect(() => {
    setInput("")
    resetResponses()
  }, [inputMethod])

  const makeComparisons = (responseArray) => {
    // have to use responseArray instead of useState variables because values
    // will be stale. 
    // getResponses changed the state of response variables previously,
    // upon reaching this function, variables will still be referencing stale values
    let temp = [
      [checkDialog, responseArray[1], setScoreDialog],
      [checkMICL, responseArray[2], setScoreMICL],
      [checkRajat, responseArray[3], setScoreRajat],
      [checkRushi, responseArray[4], setScoreRushi],
      [checkBani, responseArray[5], setScoreBani]
    ]
    temp.forEach(([check, response, setScore]) => {
      if (check) {
        let req = { responses: [response, responseArray[0]] }
        props.makeResponseComparisonRequest(req)
          .then(val => { setScore(val) })
          .catch(e => {
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

    props.similarQuestionsAPI(params).then(val => {
      setSimilarQuestions(val)
    })

    var promiseArray = []
    setLoadingJamie(true)
    var askJamiePromise = props.askJamieAPI(params)
    promiseArray.push(askJamiePromise)

    askJamiePromise.then(res => {
      setResponseJamie(res)
      setLoadingJamie(false)
    })

    let temp = [
      [checkDialog, props.dialogAPI, setLoadingDialog, setResponseDialog],
      [checkMICL, props.miclAPI, setLoadingMICL, setResponseMICL],
      [checkRajat, props.rajatAPI, setLoadingRajat, setResponseRajat],
      [checkRushi, props.rushiAPI, setLoadingRushi, setResponseRushi],
      [checkBani, props.baniAPI, setLoadingBani, setResponseBani],
    ]

    temp.forEach(([check, apiCall, setLoading, setResponse]) => {
      if (check) {
        setLoading(true)
        var promise = apiCall(params)
        promiseArray.push(promise)

        promise.then(res => {
          setResponse(res)
          setLoading(false)
        })
      }
      else {
        promiseArray.push("")
      }
    })

    Promise.all(promiseArray)
      .then(values => {
        // console.log(values)
        makeComparisons(values)
      })
  }

  const resetResponses = () => {
    setSimilarQuestions(null)

    setResponseJamie("")
    setResponseDialog("")
    setResponseMICL("")
    setResponseRajat("")
    setResponseRushi("")
    setResponseBani("")

    setScoreDialog(null)
    setScoreMICL(null)
    setScoreRajat(null)
    setScoreRushi(null)
    setScoreBani(null)
  }

  return (
    <React.Fragment>
      {/* Description Card */}
      <Grid container className={classes.descriptionCardGrid} justify="center">
        <Card style={{ paddingRight: 10 }}>
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
                onChange={(e, newValue) => { setInputMethod(newValue) }}
              >
                <Tab label="Text" />
                <Tab label="Speech" />
              </Tabs>
            </Paper>
          </Grid>

          <Grid item style={{ flexGrow: 1, maxWidth: 700 }}>

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
                    onChange={(e) => { setInput(e.target.value) }}
                  />
                  <Button onClick={() => { getResponses(input) }} variant="contained" color="primary">Submit</Button>
                </FormControl>
              </TabPanel>
              {/* Speech to text */}
              <TabPanel value={inputMethod} index={1}>
                <Record
                  input={input}
                  setInput={setInput}
                  backendURL={props.backendURL}
                  resetResponses={resetResponses}
                  getResponses={getResponses}
                />
                <br />
                <Typography variant='h6'>Transcription: {input}</Typography>
              </TabPanel>
            </Paper>

            {/* Suggested Questions drop down menu */}
            <Collapse in={similarQuestions !== null}>
              <Paper style={{ marginTop: 3 }}>
                <List dense>
                  <ListItem><Typography variant='h6'>You might be interested: </Typography></ListItem>
                  {similarQuestions && similarQuestions.map((item) => {
                    if (item !== input) return (
                      <ListItem button onClick={(e) => {
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
              topic={topic}
              setTopic={setTopic}
            />
          </Grid>

          <Grid item>
            <Paper elevation={1}>
              <List component="nav">
                <ListItem button onClick={(event) => { setChatbotMenuRef(event.currentTarget) }}>
                  <ListItemText primary="Chatbot Services" secondary={
                    (checkDialog ? "Dialogflow " : "") +
                    (checkMICL ? "Andrew " : "") +
                    (checkRajat ? "Rajat " : "") +
                    (checkRushi ? "Rushi " : "") +
                    (checkBani ? "Bani" : "")
                  } />
                </ListItem>
              </List>
            </Paper>
            <Menu
              anchorEl={chatbotMenuRef}
              keepMounted
              open={Boolean(chatbotMenuRef)}
              onClose={() => { setChatbotMenuRef(null) }}
            >
              {availableDialog &&
                <MenuItem style={{ display: 'flex', justifyContent: "space-between" }}>
                  Dialogflow
                  <Checkbox checked={checkDialog} name="checkDialog" value="Dialogflow"
                    onChange={(e) => {
                      setCheckDialog(e.target.checked)
                      if (!e.target.checked) setResponseDialog("")
                    }} />
                </MenuItem>}
              {availableMICL &&
                <MenuItem style={{ display: 'flex', justifyContent: "space-between" }}>
                  Andrew
                  <Checkbox checked={checkMICL} name="checkMICL" value="MICL"
                    onChange={(e) => {
                      setCheckMICL(e.target.checked)
                      if (!e.target.checked) setResponseMICL("")
                    }} />
                </MenuItem>}
              {availableRajat &&
                <MenuItem style={{ display: 'flex', justifyContent: "space-between" }}>
                  Rajat
                  <Checkbox checked={checkRajat} name="checkRajat" value="Rajat"
                    onChange={(e) => {
                      setCheckRajat(e.target.checked)
                      if (!e.target.checked) setResponseRajat("")
                    }} />
                </MenuItem>}
              {availableRushi &&
                <MenuItem style={{ display: 'flex', justifyContent: "space-between" }}>
                  Rushi
                  <Checkbox checked={checkRushi} name="checkRushi" value="Rushi"
                    onChange={(e) => {
                      setCheckRushi(e.target.checked)
                      if (!e.target.checked) setResponseRushi("")
                    }} />
                </MenuItem>}
              {availableBani &&
                <MenuItem style={{ display: 'flex', justifyContent: "space-between" }}>
                  Bani
                  <Checkbox checked={checkBani} name="checkBani" value="Bani"
                    onChange={(e) => {
                      setCheckBani(e.target.checked)
                      if (!e.target.checked) setResponseBani("")
                    }} />
                </MenuItem>}
            </Menu>
          </Grid>

        </Grid>

        {/* below are the various chatbots */}
        <Grid item xs={12} sm={6} md={4}>
          <Jamie
            loadingJamie={loadingJamie}
            responseJamie={responseJamie}
          />
        </Grid>

        {checkDialog &&
          <Grid item xs={12} sm={6} md={4}>
            <AnswerModel
              value="Dialogflow"
              loading={loadingDialog}
              response={responseDialog}
              score={scoreDialog}
            />
          </Grid>
        }

        {checkMICL &&
          <Grid item xs={12} sm={6} md={4}>
            <AnswerModel
              value="Andrew"
              loading={loadingMICL}
              response={responseMICL}
              score={scoreMICL}
            />
          </Grid>
        }

        {checkRajat &&
          <Grid item xs={12} sm={6} md={4}>
            <AnswerModel
              value="Rajat"
              loading={loadingRajat}
              response={responseRajat}
              score={scoreRajat}
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

        {checkBani &&
          <Grid item xs={12} sm={6} md={4}>
            <AnswerModel
              value="Bani"
              loading={loadingBani}
              response={responseBani}
              score={scoreBani}
            />
          </Grid>
        }

      </Grid>


    </React.Fragment>
  )
}