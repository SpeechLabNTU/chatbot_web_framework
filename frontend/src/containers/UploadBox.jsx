import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import DirectionsIcon from '@material-ui/icons/Directions';

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
}));



export default function CustomizedInputBase(props) {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Upload text file"
        inputProps={{ 'aria-label': 'search google maps' }}
        disabled
      />
      
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton component="label" color="primary" className={classes.iconButton} aria-label="directions">
      <input type="file" id="myFile" name="filename" style={{display: 'none'}}/>
        <DirectionsIcon />
        
      </IconButton>
    </Paper>
  );
}
