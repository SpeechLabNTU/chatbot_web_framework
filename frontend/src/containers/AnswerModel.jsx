import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
const form={display:'block'};

class AnswerModel extends Component{

  render(){
    return (

      <div>
        <FormControl variant="outlined" style={form}>
          <TextField
            style={{width:'100%'}}
            id="outlined-multiline-static"
            label={this.props.value}
            multiline
            rows="10"
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
            helperText= {this.props.similarity ? "Similarity Score: " + this.props.score : "Comparison Inactive"}
            value={this.props.loading ? "loading...": this.props.response}
          />
        </FormControl>
      </div>
    );
  }
}

export default AnswerModel
