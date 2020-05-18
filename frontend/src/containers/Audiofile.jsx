import React, { useState }from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';
import FormControl from '@material-ui/core/FormControl'
import PropTypes from 'prop-types';
import axios from 'axios';

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

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
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
  tableContainer: {
    paddingTop: '50px',
  },
  table: {
    width: 'auto',
    //minWidth: 1200
  },
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


export default function Audiofile(props) {

    let [inputText, setInputText] = useState("")

    const [rows, updateRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    
    let tablecontent = []
    
    const classes = useStyles();

    //---------------------------Page Change Handler-----------------------------------------
    const handleChangePage = (event, newPage) =>{
      setPage(newPage)
    }

    const handleChangeRowsPerPage = (event) =>{
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    }

    
    //--------------------------Button event handlers--------------------------
    function onChangehandler(e){
      var files = Array.from(e.target.files);
      files.sort()

      files.forEach( file => {
        tablecontent.push(createData(file.name, "loading...", "loading..."))
      })
      updateRows(tablecontent)
      setInputText(`${files.length} files uploaded`)

      getTranscriptions(files)
    };

    //--------------------Audio file handlers-------------------
    function getTranscriptions(files) {
      var arr1 = []
      var arr2 = []
      for (let i=0; i<files.length; i++){
        arr1.push(i)
        arr2.push(i)
      } // arrays to track processing of files

      // make 2 concurrent requests, due to Speech Lab's limit of 3
      for (let i=0; i < 2; i++) {
        setTimeout( () => {requestToSpeechLab(files, arr1)}, 500)
      }

      // make 5 concurrent requests (not sure what is limit)
      for (let i=0; i < 5; i++) {
        setTimeout( () => {requestToGoogleAPI(files, arr2)}, 500)
      }
    }

    function requestToSpeechLab(files, array) {
      var fileIndex = array.shift()
      var file = files[fileIndex]
      if (file === undefined) {
        return null
      }
      return (new Promise( (resolve, reject) => {
        let formData =  new FormData()
        formData.append('file', file)
        formData.append('token', props.token)

        axios({
          url: `${props.backendUrl}/api/speechlabs`,
          method: 'POST',
          data: formData,
          headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
          },
        }).then( response => {
          var data = response.data
          //console.log(data)

          // handle response from Speech Labs 
          if (data.status_code === 200 && data.status === 0) {
            let index = tablecontent.findIndex( item => item.filename === file.name )
            let updatedRow = tablecontent[index]
            updatedRow.speechlabs = data.text

            tablecontent = [...tablecontent.slice(0,index), updatedRow, ...tablecontent.slice(index+1)]
            updateRows(tablecontent)
            
            resolve(1000)  // wait 1s before next call
          }
          else {
            array.unshift(fileIndex)  // push file index back into array
            resolve(10000)  // wait 10s before next call
          }
            
        }).catch( err => {
          console.log('Error during request to backend for speechlabs: ')
          console.log(err)
          reject()
        })
      }).then( value => {
        setTimeout( () => {requestToSpeechLab(files, array)}, value) // wait value second before making request to allow buffer time at Speech Lab's server
      }).catch( err => console.log(err) ))
    }

    function requestToGoogleAPI(files, array) {
      var fileIndex = array.shift()
      var file = files[fileIndex]
      if (file === undefined) {
        return null
      }

      return (new Promise( (resolve, reject) => {
        let formData =  new FormData()
        formData.append('file', file)

        axios({
          url: `${props.backendUrl}/api/google`,
          method: 'POST',
          data: formData,
          headers: {
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data',
          },
        }).then( response => {
          let data = response.data
          //console.log(data)

          let index = tablecontent.findIndex( item => item.filename === file.name )
          let updatedRow = tablecontent[index]
          updatedRow.googleapi = data.text

          tablecontent = [...tablecontent.slice(0,index), updatedRow, ...tablecontent.slice(index+1)]
          updateRows(tablecontent)

          resolve(0)
        }).catch( err =>{
          console.log('Error during request to backend for googleapi: ')
          console.log(err)
          reject()
        })
      }).then( value =>  {
        setTimeout( () => {requestToGoogleAPI(files, array)}, value) // wait before making request
      }).catch( err => console.log(err) ))
    }

    //----------------------------Creates data contents for table listing------------------------------
    function createData(filename, speechlabs, googleapi){
      return {filename, speechlabs, googleapi}
    }

  return (
    <div>

      <Grid container style={{paddingBottom:"40px"}} justify="center">
      <Card>

          <CardContent style={{width:"500px"}}>
            <Typography color="textSecondary" gutterBottom>
              Transcription Comparison of Speech-to-text APIs
            </Typography>
            <Typography color="textSecondary">

            </Typography>
            <Typography variant="body2" component="p">
              1. Upload Audio Files (.wav, .mp3, .mp4 only)
              <br />
              2. View Table Listing of Transcriptions
            </Typography>
          </CardContent>

      </Card>
      </Grid>

      <FormControl component="fieldset">

        <Paper component="form" className={classes.root}>
            <InputBase
            className={classes.input}
            placeholder={inputText === "" ? "No Files Uploaded" : inputText}
            inputProps={{ 'aria-label': 'number of audio files uploaded' }}
            disabled
            />
            
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton component="label" color="primary" className={classes.iconButton} aria-label="directions">
            <input multiple accept=".mp4,.mp3,.wav" type="file" id="myFile" name="file" style={{display: 'none'}} onChange={onChangehandler}/>
            <DirectionsIcon />
            </IconButton>
        </Paper>

        {/* Table for response display and page management */}
        <FormControl className={classes.tableContainer}>
          <Paper variant="outlined">

            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>SpeechLabs Response</TableCell>
                  <TableCell>Google API Response</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {(rowsPerPage > 0
                  ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  :rows
                ).map((row) => (
                  <TableRow key={row.filename}>
                    <TableCell component="th" scope="row">
                      {row.filename}
                    </TableCell>
                    <TableCell>{row.speechlabs}</TableCell>
                    <TableCell>{row.googleapi}</TableCell>
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
      </FormControl>

    </div>
  );
}
