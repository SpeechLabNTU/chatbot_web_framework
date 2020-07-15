import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
const form={display:'block'};

class Rushi extends Component{

  render(){

    return (

      <div>
        <FormControl variant="outlined" style={form}>
          <TextField
              style={{width:'100%'}}
              id="outlined-multiline-static"
              label="Rushi"
              multiline
              rows="10"
              variant="outlined"
              InputProps={{
              readOnly: true,
              }}
              helperText= {this.props.similarityRushi ? "Similarity Score: " + this.props.scoreRushi : "Comparison Inactive"}
              value={this.props.loadingRushi ? "loading..." : this.props.responseRushi}
          />
        </FormControl>
      </div>
    );
  }
}

export default Rushi
