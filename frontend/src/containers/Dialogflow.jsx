import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
const form={display:'block'};

class Dialogflow extends Component{
  
  render(){
    return (
        
      <div>
        <FormControl variant="outlined" style={form}>
          <TextField
            style={{width:'100%'}}
            id="outlined-multiline-static"
            label="Dialogflow"
            multiline
            rows="10"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            helperText= {this.props.similarityDialog ? "Similarity Score: " + this.props.scoreDialog : "Comparison Inactive"} 
            value={this.props.loadingDialogflow ? "loading...": this.props.responseDialogflow}
          />
        </FormControl>
      </div>
    );
  }
}

export default Dialogflow