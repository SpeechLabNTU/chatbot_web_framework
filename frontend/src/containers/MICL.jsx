import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
const form={width:'400px'};

class MICL extends Component{
  
  render(){
    
    return (
        
      <div>
        <FormControl variant="outlined" style={form}>
          <TextField
              id="outlined-multiline-static"
              label="MICL"
              multiline
              rows="10"
              variant="outlined"
              InputProps={{
              readOnly: true,
              }}
              helperText= {this.props.similarityMICL ? "Similarity Score: " + this.props.scoreMICL : this.props.disimilarityMICL ? "Similarity Score " + this.props.scoreMICL: "Comparison Inactive"}
              value={this.props.loadingMICL ? "loading..." : this.props.responseMICL} 
          />
        </FormControl>
      </div>
    );
  }
}

export default MICL