import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';

const textFieldOutput={width:'400px'};

class Dialogflow extends Component{
  
  render(){
    return (
        
      <div>
        <TextField
            id="outlined-multiline-static"
            label="Ask Jamie"
            multiline
            rows="10"
            variant="outlined"
            InputProps={{
            readOnly: true,
            }}
            style={textFieldOutput}
            value={this.props.loadingJamie ? "loading..." : this.props.responseJamie} 
        />

      </div>
    );
  }
}

export default Dialogflow