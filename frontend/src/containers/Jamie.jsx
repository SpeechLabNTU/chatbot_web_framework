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
            style={{width: '100%'}}
            id="outlined-multiline-static"
            label="Ask Jamie"
            multiline
            rows="10"
            variant="outlined"
            InputProps={{
            readOnly: true,
            }}
            value={this.props.loadingJamie ? "loading..." : this.props.responseJamie} 
        />
        </FormControl>
      </div>
    );
  }
}

export default Dialogflow