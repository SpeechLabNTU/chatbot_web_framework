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
// import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Charts from "./Charts";

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
    minWidth: 120,
  },
  tableContainer: {
    paddingTop: '50px',
  }

}));

let fileReader;

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
    const [scoreArray, setscoreArray] = React.useState([]);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    const tablecontent = []
    const scorecontent = []

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

    //--------------------------Chatbot Service Change Handler--------------------------------
    const handleChange = event => {
      setValue(event.target.value);
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

    //----------------------------Similarity Comparison---------------------------------------
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

    //----------------------Recursive function to return results one at a time----------------
    async function handleSingleInput(textArray, i, textArrayLength){

      if(i === textArrayLength -1 ){
        setscoreArray(scorecontent)
        setGraph(true)
        return
      }else{
        let query = textArray[i]
        let ques = {question: query}
        let service = ""

        if(value === 'dialogflowAPI'){
            service = props.dialogflowAPI(ques)
        }else if (value === 'miclAPI'){
            service = props.miclAPI(ques)
        }else if (value === 'rajatAPI'){
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
        })

      }
      
    }

    //----------------------Read file contents for computing response comparison----------------------
    const handleFileRead = (e)=>{
      const content = fileReader.result;
      let textArray = content.split('\n');
      handleSingleInput(textArray,0,textArray.length)
    }

    //---------------------------On file upload, call handleFileRead to load content------------------
    function onChangehandler(e){
        let file = e.target.files[0];
        fileName = file.name
        setFilename(fileName);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file)
    };

    //----------------------------Creates data contents for table listing------------------------------
    function createData(input, jamie, dialogflow, score){
      return {input, jamie, dialogflow, score}
    }

  return (
    <div>
    {/* File Upload Form */}
    <FormControl component="fieldset">
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={fileName === "" ? "No Files Uploaded": fileName}
          inputProps={{ 'aria-label': 'Accuracy Plot' }}
          disabled
        />
        
        <Divider className={classes.divider} orientation="vertical" />

        {value === '' 
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
      
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        onChange={handleChange}
      >
        <MenuItem value="dialogflowAPI">Dialogflow</MenuItem>
        <MenuItem value="miclAPI">Andrew</MenuItem>
        <MenuItem value="rajatAPI">Rajat</MenuItem>
      </Select>
      <FormHelperText>Chat Model Selection</FormHelperText>
    </FormControl>
    
    
    {/* Graph Generation Button */}
    <FormControl className={classes.modeSelect}>
        {graph === false
        ?<Button disabled variant="contained" color="primary">Generate Graph</Button>
        :<Button onClick={handleClickOpen} variant="contained" color="primary">Generate Graph</Button>
        }
    </FormControl>
    
    {/* Table for response display and page management */}
    <FormControl className={classes.tableContainer}>
      <Paper variant="outlined">
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Input</TableCell>
                <TableCell>Ask Jamie Response</TableCell>
                <TableCell>Dialogflow Response</TableCell>
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
        <DialogTitle id="alert-dialog-title">{"Use Google's location service?"}</DialogTitle>
        <DialogContent style={{minWidth:600}}>
          <Charts responseScoreArray={scoreArray} chatbot={value}/>
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
