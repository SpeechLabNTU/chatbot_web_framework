import React, { useState }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import RadioGroup from '@material-ui/core/RadioGroup'
import Radio from '@material-ui/core/Radio'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField';

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

export default function CustomizedInputBase(props) {
    let [fileName, setFilename] = useState("")
    const [value, setValue] = React.useState('null');
    let [arrayQuery, setArrayQuery] = useState([])
    
    const handleChange = event => {
      setValue(event.target.value);
    };
    
    const classes = useStyles();
    const handleFileRead = (e)=>{
        const content = fileReader.result;
        let textArray = content.split('\n');
        setArrayQuery(textArray)

        // for(let i = 0; i<textArray.length;i++){
        //   console.log(textArray[i])
        //   props.handleSingleInput(textArray[i],value);
        // }
        props.handleQueryInput(textArray, value);
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
      <Paper component="form" className={classes.root}>
        <InputBase
          className={classes.input}
          placeholder={fileName === "" ? "No Files Uploaded": fileName}
          inputProps={{ 'aria-label': 'search google maps' }}
          disabled
        />
        
        <Divider className={classes.divider} orientation="vertical" />
        <IconButton component="label" color="primary" className={classes.iconButton} aria-label="directions">
        <input type="file" id="myFile" name="filename" style={{display: 'none'}} onChange={onChangehandler}/>
          <DirectionsIcon />
        </IconButton>

      </Paper>

      <RadioGroup aria-label="position" name="position" value={value} onChange={handleChange} row>

        <FormControlLabel
          value="Dialogflow"
          control={<Radio color="primary" />}
          label="Dialogflow"
        />

      </RadioGroup>

      <TextField className={classes.textField}
          id="outlined-multiline-static"
          multiline
          rows="14"
          value={arrayQuery}
          variant="outlined"
          disabled
        />

    </FormControl>
  );
}
