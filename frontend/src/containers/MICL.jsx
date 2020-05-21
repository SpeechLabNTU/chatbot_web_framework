import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
const form={display:'block'};

class MICL extends Component{
  
  render(){
    
    return (
        
      <div>
        <FormControl variant="outlined" style={form}>
          <TextField
              style={{width:'100%'}}
              id="outlined-multiline-static"
              label="Andrew"
              multiline
              rows="10"
              variant="outlined"
              InputProps={{
              readOnly: true,
              }}
              helperText= {this.props.similarityMICL ? "Similarity Score: " + this.props.scoreMICL : "Comparison Inactive"}
              value={this.props.loadingMICL ? "loading..." : this.props.responseMICL} 
          />
        </FormControl>
      </div>
    );
  }
}

export default MICL