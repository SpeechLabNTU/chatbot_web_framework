import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles((theme) => ({
  topBarPaper: {
    height: '5em',
    display: "flex",
    alignItems: 'center'
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

  const classes = useStyles()

  const [editQuestion, setEditQuestion] = React.useState(false)
  const [editAnswer, setEditAnswer] = React.useState(false)
  const [newQuestion, setNewQuestion] = React.useState(props.selectedIndex ? props.data[props.selectedIndex].Question : "")
  const [newAnswer, setNewAnswer] = React.useState(props.selectedIndex ? props.data[props.selectedIndex].Answer : "")

  React.useEffect( () => {
    if (props.selectedIndex === null) return
    if (newQuestion !== props.data[props.selectedIndex].Question || newAnswer !== props.data[props.selectedIndex].Answer) {
      updateData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editQuestion, editAnswer])

  const updateData = () => {
    let tempData = []
    props.data.map( (val) => {
      if (val.Index === props.selectedIndex) {
        tempData.push({Index:props.selectedIndex, Question:newQuestion.trim(), Answer:newAnswer.trim()})
      }
      else {
        tempData.push(val)
      }
      return null
    })
    props.setData(tempData)
    props.setDataChanged(true)
  }

  return (
    <Grid container spacing={2}>
      <Grid container item>
        <Paper className={classes.topBarPaper} style={{marginRight:10}}>
        <IconButton onClick={()=>{props.setSelectedIndex(null)}}>
          <ArrowBackIcon fontSize="large"/>
        </IconButton>
        </Paper>
        <Paper className={classes.topBarPaper} style={{flex:1}}>
        <Typography variant='h5' className={classes.topHeader}>
          Question and Answer
        </Typography>
        </Paper>
      </Grid>

      <Grid item container>
        <Paper className={classes.bodyPaper}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <Typography variant="h5" className={classes.bodyHeader}>
            Question:
            </Typography>
            <IconButton className={classes.bodyHeader} onClick={()=>{
              setNewQuestion((p)=>(p.trim()))
              setEditQuestion((prev)=>!prev)
            }}>
              {editQuestion ? <DoneIcon /> : <EditIcon />}
            </IconButton>
          </div>
          {editQuestion ?
          <TextField className={classes.bodyText} variant="outlined" multiline
          value={newQuestion} onChange={(e)=>{setNewQuestion(e.target.value)}}/>
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
              setNewAnswer((p)=>(p.trim()))
              setEditAnswer((prev)=>!prev)
            }}>
              {editAnswer ? <DoneIcon /> : <EditIcon />}
            </IconButton>
          </div>
          {editAnswer ?
          <TextField className={classes.bodyText} variant="outlined" multiline
          value={newAnswer} onChange={(e)=>{setNewAnswer(e.target.value)}}/>
          :
          <Typography className={classes.bodyText}>
          {newAnswer ? newAnswer : ""}
          </Typography>
          }

        </Paper>
      </Grid>

    </Grid>
  )
}
