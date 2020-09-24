import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
  topBarPaper: {
    height: '5em',
    display: "flex",
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow:"hidden"
  },
  topBarItems: {
    margin: theme.spacing(2),
  },
  bodyPaper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topHeader: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    whiteSpace: 'nowrap',
  },
  bodyHeader: {
    margin: theme.spacing(3)
  },
  bodyText: {
    flex: 1,
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    marginBottom: theme.spacing(3),
    whiteSpace: 'pre-line'
  }
}))

export default function SingleQuestion(props) {

  const [editQuestion, setEditQuestion] = React.useState(true)
  const [warnQuestion, setWarnQuestion] = React.useState(false)
  const [editAnswer, setEditAnswer] = React.useState(true)
  const [warnAnswer, setWarnAnswer] = React.useState(false)
  const [newQuestion, setNewQuestion] = React.useState("")
  const [newAnswer, setNewAnswer] = React.useState("")

  const classes = useStyles()

  const addNewQuestion = (question, answer) => {
    let tempData = []
    let i = 1
    tempData.push( {Index: 0, Question: question, Answer: answer} )
    props.data.forEach( (val, idx) => {
      tempData.push(val)
      tempData[i].Index=i
      i++
    })
    props.setData(tempData)
    props.setDataChanged(true)
  }

  return (
    <Grid container spacing={2}>
      <Grid container item>
        <Paper className={classes.topBarPaper} style={{flex:1}}>
        <Typography variant='h5' className={classes.topHeader}>
          Add New Question
        </Typography>
        <div style={{display:'flex', alignItems:'center'}}>
          <Button className={classes.topBarItems} variant="contained" color="primary"
          disabled={newQuestion==="" || newAnswer==="" || editQuestion || editAnswer}
          onClick={()=>{
            addNewQuestion(newQuestion, newAnswer)
            props.setAddNewQuestion(false)
          }}>
          Save
          </Button>
          <Button className={classes.topBarItems} variant="contained" color="primary"
          onClick={()=>{props.setAddNewQuestion(false)}}>
          Cancel
          </Button>
        </div>
        </Paper>
      </Grid>


      <Grid item container>
        <Paper className={classes.bodyPaper}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography variant="h5" className={classes.bodyHeader}>
            Question:
            </Typography>
            <IconButton className={classes.bodyHeader} onClick={()=>{
              setNewQuestion(p=>p.trim())
              setEditQuestion((prev)=>!prev)
            }}>
              {editQuestion ? <DoneIcon /> : <EditIcon />}
            </IconButton>
          </div>
          {editQuestion ?
          <TextField className={classes.bodyText} variant="outlined" multiline
          value={newQuestion} error={warnQuestion}
          onChange={(e)=>{
            setNewQuestion(e.target.value)
            setWarnQuestion(false)
          }}/>
          :
          <Typography className={classes.bodyText}>
          {newQuestion ? newQuestion : ""}
          </Typography>
          }

        </Paper>
      </Grid>

      <Grid item container>
        <Paper className={classes.bodyPaper}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography variant="h5"  className={classes.bodyHeader}>
            Answer:
            </Typography>
            <IconButton className={classes.bodyHeader} onClick={()=>{
              setNewAnswer(p=>p.trim())
              setEditAnswer((prev)=>!prev)
            }}>
              {editAnswer ? <DoneIcon /> : <EditIcon />}
            </IconButton>
          </div>
          {editAnswer ?
          <TextField className={classes.bodyText} variant="outlined" multiline
          value={newAnswer} error={warnAnswer}
          onChange={(e)=>{
            setNewAnswer(e.target.value)
            setWarnAnswer(false)
          }}/>
          :
          <Typography className={classes.bodyText}>
          {newQuestion ? newAnswer : ""}
          </Typography>
          }

        </Paper>
      </Grid>

    </Grid>
  )
}
