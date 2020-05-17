import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';
import FormControl from '@material-ui/core/FormControl'

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
  textField: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

let fileReader;

export default function Audiofile(props) {
    let [fileName, setFilename] = useState("")
    let [arrayQuery, setArrayQuery] = useState([])
    
    const classes = useStyles();
    const handleFileRead = (e)=>{
        const content = fileReader.result;
        let textArray = content.split('\n');
        setArrayQuery(textArray)

        // for(let i = 0; i<textArray.length;i++){
        //   console.log(textArray[i])
        //   props.handleSingleInput(textArray[i],value);
        // }
    }

    function onChangehandler(e){
        let file = e.target.files[0];
        fileName = file.name
        setFilename(fileName);
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file)
    };
  return (
    <FormControl component="fieldset">
    
        <h4>Under Development</h4>
        <Paper component="form" className={classes.root}>
            <InputBase
            className={classes.input}
            placeholder={fileName === "" ? "No Files Uploaded": fileName}
            inputProps={{ 'aria-label': 'search google maps' }}
            disabled
            />
            
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton component="label" color="primary" className={classes.iconButton} aria-label="directions">
            <input disabled type="file" id="myFile2" name="filename" style={{display: 'none'}} onChange={onChangehandler}/>
            <DirectionsIcon />
            </IconButton>

        </Paper>

    </FormControl>
  );
}
