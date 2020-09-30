import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import Collapse from '@material-ui/core/Collapse';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

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
    whiteSpace: 'pre-line',
    "& .MuiInputBase-input.Mui-disabled": {
      color: 'black'
    }
  },
  questionInput: {
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  tableContainer: {
    marginRight: theme.spacing(5),
    marginLeft: theme.spacing(5),
    marginBottom: theme.spacing(3),
  },
  tableRow: {
    display: 'flex',
  },
  tableCell: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    "& .MuiInputBase-input.Mui-disabled": {
      color: 'black'
    }
  },
  tableCellText: {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
}))

function TablePaginationActions(props){
  const classes = useStyles();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  //-----------------------------Pagination Handler-----------------------------------
  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0)
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1)
  }

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1)
  }

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count/rowsPerPage)-1));
  }

  //------------------------------Pagination Icons-------------------------------------
  return (
    <div className={classes.pagination}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

//---------------------------Pagination Action Props---------------------------------------
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function SingleQuestion(props) {

  const [editQuestion, setEditQuestion] = React.useState(true)
  const [warnQuestion, setWarnQuestion] = React.useState(false)
  const [editAnswer, setEditAnswer] = React.useState(true)
  const [warnAnswer, setWarnAnswer] = React.useState(false)
  const [newQuestion, setNewQuestion] = React.useState("")
  const [newAnswer, setNewAnswer] = React.useState("")

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [altPhrases, setAltPhrases] = React.useState([])
  const [altPhrasesCopy, setAltPhrasesCopy] = React.useState([])
  const [phrasesChanged, setPhrasesChanged] = React.useState(false)
  const [newAlt, setNewAlt] = React.useState("")
  const [editAltPhrase, setEditAltPhrase] = React.useState(altPhrases.map(()=>false))

  const classes = useStyles()

  React.useEffect( () => {
    setEditAltPhrase(altPhrases.map(()=>false))
  }, [altPhrases])

  const addNewQuestion = (question, answer) => {
    let tempData = []
    let i = 1
    tempData.push( {Index: 0, Question: question, Answer: answer, Alternatives: (phrasesChanged ? altPhrasesCopy : altPhrases)} )
    props.data.forEach( (val, idx) => {
      tempData.push(val)
      tempData[i].Index=i
      i++
    })
    props.setData(tempData)
    props.setDataChanged(true)
    setPhrasesChanged(false)
  }

  const handleChangePage = (event, newPage) =>{
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) =>{
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
              {editQuestion ? <DoneIcon color='primary'/> : <EditIcon color='primary'/>}
            </IconButton>
          </div>
          <TextField className={classes.bodyText} variant="outlined" multiline
          value={newQuestion} error={warnQuestion} disabled={!editQuestion}
          onChange={(e)=>{
            setNewQuestion(e.target.value)
            setWarnQuestion(false)
          }}/>

          <Divider/>

          <Typography variant="h5" className={classes.bodyHeader}>
          Alternative Phrasings:
          </Typography>

          <Paper variant='outlined' className={classes.questionInput}>
            <Input disableUnderline fullWidth multiline placeholder={"Enter new alternate phrasing for original question."}
            value={newAlt}
            onChange={(e)=>{
              if (phrasesChanged) {
                setAltPhrases(altPhrasesCopy)
                setPhrasesChanged(false)
              }
              if (e.target.value.trim() === "") {setNewAlt("")}
              else if (e.target.value.endsWith("\n")) {
                let temp = e.target.value.trim()
                let tempData = [temp, ...altPhrases]
                setAltPhrases(tempData)
                setAltPhrasesCopy(tempData)
                setNewAlt("")
              }
              else {
                setNewAlt(e.target.value)
              }
            }}/>
          </Paper>

          <Collapse in={altPhrases.length>0}>
          <Paper className={classes.tableContainer} variant="outlined">
            <Table aria-label="simple table" >
              <TableBody>
                {(rowsPerPage > 0
                  ? altPhrases.slice(page*rowsPerPage, page*rowsPerPage + rowsPerPage)
                  : altPhrases
                ).map((row, index) => (
                  <TableRow key={row} className={classes.tableRow}>
                    <TableCell className={classes.tableCell} component="th" scope="row">
                      <IconButton onClick={()=>{
                        let temp = [...editAltPhrase]
                        temp[index] = !temp[index]
                        setEditAltPhrase(temp)
                        setAltPhrases(altPhrasesCopy)
                      }}>
                        {editAltPhrase[index] ? <DoneIcon color='primary'/> : <EditIcon color='primary'/>}
                      </IconButton>
                      <Input disableUnderline fullWidth multiline disabled={!editAltPhrase[index]} className={classes.tableCellText}
                      id={`${index}`} defaultValue={altPhrases[index]}
                      onChange={(e)=>{
                        setPhrasesChanged(true)
                        let temp = [...altPhrasesCopy]
                        temp[e.target.id] = e.target.value
                        setAltPhrasesCopy(temp)
                      }}/>
                      <IconButton onClick={()=>{
                        let temp = altPhrases.filter((v, i)=>(i!==index))
                        setAltPhrases(temp)
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={2}
                    count={altPhrases.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { 'aria-label': 'rows per page' },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Paper>
          </Collapse>

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
              {editAnswer ? <DoneIcon color='primary' /> : <EditIcon color='primary'/>}
            </IconButton>
          </div>
          <TextField className={classes.bodyText} variant="outlined" multiline
          value={newAnswer} error={warnAnswer} disabled={!editAnswer}
          onChange={(e)=>{
            setNewAnswer(e.target.value)
            setWarnAnswer(false)
          }}/>

        </Paper>
      </Grid>

    </Grid>
  )
}
