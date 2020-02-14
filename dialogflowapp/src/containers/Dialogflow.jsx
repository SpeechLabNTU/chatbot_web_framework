import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';

const textFieldOutput={width:'400px'};
const textFieldsuccess={width:'400px',border:'1px solid #00ff00'};
const textFielderror={width:'400px',border:'1px solid #ff0000'};


class Dialogflow extends Component{
  
  render(){
    return (
        
      <div>
        <TextField
          id="outlined-multiline-static"
          label="Dialogflow"
          multiline
          rows="10"
          variant="outlined"
          InputProps={{
            readOnly: true,
          }}
          style={this.props.similarityDialog ? textFieldsuccess: this.props.disimilarityDialog ? textFielderror: textFieldOutput} 
          value={this.props.loadingDialogflow ? "loading...": this.props.responseDialogflow}
        />

      </div>
    );
  }
}

export default Dialogflow