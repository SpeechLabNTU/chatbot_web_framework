import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
const form={width:'400px'};

class Rajat extends Component{
  
  render(){
    
    return (
        
      <div>
        <FormControl variant="outlined" style={form}>
          <TextField
              id="outlined-multiline-static"
              label="Rajat"
              multiline
              rows="10"
              variant="outlined"
              InputProps={{
              readOnly: true,
              }}
              helperText= {this.props.similarityRajat ? "Similarity Score: " + this.props.scoreRajat : this.props.disimilarityRajat ? "Similarity Score " + this.props.scoreRajat: "Comparison Inactive"}
              value={this.props.loadingRajat ? "loading..." : this.props.responseRajat} 
          />
        </FormControl>
      </div>
    );
  }
}

export default Rajat