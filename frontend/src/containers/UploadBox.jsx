import React, { useState }from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';
import FormControl from '@material-ui/core/FormControl'
import axios from "axios";
import FormHelperText from '@material-ui/core/FormHelperText';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import LinearProgress from '@material-ui/core/LinearProgress';

import Chartplotly from "./Chartplotly";

const useStyles = makeStyles(theme => ({
  pagination: {
    flexShrink: 0,
    marginleft: theme.spacing(2.5)
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 500,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  table: {
    width: 'auto'
    // minWidth: 1200
  },
  modeSelect: {
    paddingLeft: '50px',
    paddingBottom: '30px',
    minWidth: 120,
  },
  tableContainer: {
    paddingTop: '30px',
  }

}));

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
      <div className={classes.root}>
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


export default function CustomizedInputBase(props) {
    let [fileName, setFilename] = useState("");
    const [value, setValue] = React.useState('');
    const [rows, updateRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [graph, setGraph] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [load, setLoad] = React.useState(false);
    const [scoreArray, setscoreArray] = React.useState([]);
    const [completed, setCompleted] = React.useState(0);
    const [text, setText] = React.useState([]);
    const [submit, setSubmit] = React.useState(false);

    const [upload, setUpload] = React.useState(false);
    const [option, setOption] = React.useState(false);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    let tablecontent = []
    let scorecontent = []
    
    //---------------------------Generate Report Pop Up Handler-------------------------------
    const handleClickOpen = () =>{
      setOpen(true);
    };

    const handleClose = () =>{
      setOpen(false);
    };


    //---------------------------Page Change Handler-----------------------------------------
    const handleChangePage = (event, newPage) =>{
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) =>{
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    }

    //----------------Promise to clear state and array of Chart and Table Array---------------
    function clearContent(){

      return new Promise(function(resolve, reject){

        try{
          //Clear Array content for state re-population
          tablecontent = []
          scorecontent = []
          
          //Clear Chart and Table State
          setscoreArray([])
          updateRows([]);

          //Disable Chart
          setGraph(false)

          resolve("Ok")
        }catch(e){
          reject(e)
        }
      
      });
          
    }

    function handleAnalysis(){

      let clear = clearContent()
      clear.then((val)=>{
        if (val === 'Ok'){
          setLoad(true)
          setSubmit(true)
        }else{
          console.log(val)
        }
      }).then(()=>{
        handleSingleInput(text,0,text.length)
      })
    }

    //--------------------------Chatbot Service Change Handler--------------------------------
    const handleChange = event => {
        setValue(event.target.value);
        setOption(true)
        
        //Clear Chart and Table State
        setscoreArray([])
        updateRows([]);
        setGraph(false)
        
    };
    
    const classes = useStyles();

    //------------------------------Response Summarizer---------------------------------------
    function summarizer(result){
      var array = []
      var summary = "";
      array = result.split(" ")
      if (array.length < 40){
        summary = result
      }else{
        for (var i = 0;i<40;i++){
          if (i === 39){
            summary += array[i] + "..."
          }else{
            summary += array[i] + " "
          }
        }
      }
      
      return summary 
    }

    //---------------------------------Similarity Comparison---------------------------------------
    function ResponseComparison(req){

      return new Promise(function(resolve, reject){
        axios.post('http://localhost:3001/flask/api/responseCompare',req)
          .then((res)=>{
              let probability = res.data.reply
              resolve(probability)
          }).catch(error=>{
            reject(error)
          });
          
      });
          
    }

    //----------------------Recursive function to return results one at a time--------------------
    async function handleSingleInput(textArray, i, textArrayLength){

      if(i === textArrayLength -1 ){
        setText(textArray)
        setscoreArray(scorecontent)
        setGraph(true)
        setLoad(false)
        setCompleted(0)
        setSubmit(false)
        return 
      }else{
        let query = textArray[i]
        let ques = {question: query}
        let service = ""

        if(value === 'Dialogflow'){
            service = props.dialogflowAPI(ques)
        }else if (value === 'Andrew'){
            service = props.miclAPI(ques)
        }else if (value === 'Rajat'){
            service = props.rajatAPI(ques)
        }

        await Promise.all([props.askJamieAPI(ques),service]).then(function(val){
            
            let req = {responses:[summarizer(val[0]),summarizer(val[1])]}
            let prob = ResponseComparison(req)
            prob.then((probval)=>{
              scorecontent.push(probval)
              tablecontent.push(createData(query, summarizer(val[0]), summarizer(val[1]), probval))
              updateRows(tablecontent)
            })
            
        }).then(()=>{
          i = i + 1
          handleSingleInput(textArray, i, textArrayLength)
          setCompleted((i/(textArrayLength-1))*100)
        })

      }
    }

    //----------------------Read file contents for computing response comparison----------------------
    const handleFileRead = (e)=>{
      
      const content = e.target.result;
      let textArray = content.split('\n');
      setText(textArray)
    }

    //---------------------------On file upload, call handleFileRead to load content------------------
    function onChangehandler(e){

      //Load file content
      try {
        let file = e.target.files[0];
        fileName = file.name
        setFilename(fileName);
        let fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file)
        setUpload(true)

        //Clear Chart and Table State
        setscoreArray([])
        updateRows([]);
        setGraph(false)

      }catch(e){
        setFilename("No file detected, please upload a line seperated text file")
        setUpload(false)
      }
        
    };

    //----------------------------Creates data contents for table listing------------------------------
    function createData(input, jamie, dialogflow, score){
      return {input, jamie, dialogflow, score}
    }

  return (
    <div>
    {/* File Upload Form */}
    <Grid container style={{paddingBottom:"40px"}} justify="center">
    <Card>

        <CardContent style={{width:"500px"}}>
          <Typography color="textSecondary" gutterBottom>
            Performance Analysis of Chatbot Service
          </Typography>
          <Typography color="textSecondary">
            
          </Typography>
          <Typography variant="body2" component="p">
            1. Upload Text File of Line-Seperated Queries
            <br />
            2. Selection of Chatbot Service for Analysis
            <br />
            3. Click on Start Analysis
            <br />
            4. View Table Listing of Responses and Accuracy Score
            <br />
            5. Graphical Report available after all responses are processed
          </Typography>
        </CardContent>
            
    </Card>
    </Grid>

    <FormControl component="fieldset">
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={fileName === "" ? "No Files Uploaded": fileName}
          inputProps={{ 'aria-label': 'Accuracy Plot' }}
          disabled
        />
        
        <Divider className={classes.divider} orientation="vertical" />

        {load ===true 
        ?<IconButton disabled component="label" color="primary" className={classes.iconButton} aria-label="directions">
        <input type="file" id="myFile" name="filename" style={{display: 'none'}} onChange={onChangehandler}/>
          <DirectionsIcon />
        </IconButton>
        :<IconButton component="label" color="primary" className={classes.iconButton} aria-label="directions">
        <input type="file" id="myFile" name="filename" style={{display: 'none'}} onChange={onChangehandler}/>
          <DirectionsIcon />
        </IconButton>
        }
        
      </Paper>

    </FormControl> 

    {/* Chatbot Selection Field */}
    <FormControl className={classes.modeSelect}>
      
      {load === false && upload === true
      ?<Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={handleChange}
        >
      
        <MenuItem value="Dialogflow">Dialogflow</MenuItem>
        <MenuItem value="Andrew">Andrew</MenuItem>
        <MenuItem value="Rajat">Rajat</MenuItem>
      </Select>
      :<Select
        disabled
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={handleChange}
        >
      
        <MenuItem value="Dialogflow">Dialogflow</MenuItem>
        <MenuItem value="Andrew">Andrew</MenuItem>
        <MenuItem value="Rajat">Rajat</MenuItem>
      </Select>
      }
      <FormHelperText>Chat Model Selection</FormHelperText>
    </FormControl>
    
    {/* Start Upload Button */}
    <FormControl className={classes.modeSelect}>
      {upload === true && option === true && submit === false
      ?<Button onClick={handleAnalysis} variant="contained" color="primary">Start Analysis</Button>
      :<Button disabled variant="contained" color="primary">Start Analysis</Button>
      }
    </FormControl>

    {/* Graph Generation Button */}
    <FormControl className={classes.modeSelect}>
        {graph === false
        ?<Button disabled variant="contained" color="primary">Generate Graph</Button>
        :<Button onClick={handleClickOpen} variant="contained" color="primary">Generate Graph</Button>
        }
    </FormControl>
    
    {load === true &&
    <LinearProgress variant="determinate" value={completed} style={{marginBottom:"5px",width:"100%"}}/>
    }

    {/* Table for response display and page management */}
    <FormControl className={classes.tableContainer}>
      <Paper variant="outlined">
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Input</TableCell>
                <TableCell>Ask Jamie Response</TableCell>
                {value === ''
                ?<TableCell>Chatbot Response</TableCell>
                :<TableCell>{value} Response</TableCell>
                }
                <TableCell align="right">Similarity Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {(rowsPerPage > 0
                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                :rows
              ).map((row) => (
                <TableRow key={row.input}>
                  <TableCell component="th" scope="row">
                    {row.input}
                  </TableCell>
                  <TableCell>{row.jamie}</TableCell>
                  <TableCell>{row.dialogflow}</TableCell>
                  <TableCell align="right">{row.score}</TableCell>
                </TableRow>
              ))}

              {emptyRows > 0 && (
                <TableRow style={{height: 53 * emptyRows}}>
                  <TableCell colSpan={6}/>
                </TableRow>
              )}

            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={3}
                  count={rows.length}
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
        
      </FormControl>
      
      {/* Popup dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Performance Analysis of ${value}`}</DialogTitle>
        <DialogContent style={{minWidth:600}}>
          <Chartplotly responseScoreArray={scoreArray} chatbot={value}/>
          {/* <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>


  </div>
  );
}
