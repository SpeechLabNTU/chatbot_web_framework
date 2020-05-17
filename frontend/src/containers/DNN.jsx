import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
// import InputLabel from '@material-ui/core/InputLabel';
const form={display:'block'};

class DNN extends Component{
  
  render(){
    
    return (
        
      <div>
        <FormControl variant="outlined" style={form}>
          <TextField
              style={{width: '100%'}}
              id="outlined-multiline-static"
              label="Text Classification Model"
              multiline
              rows="10"
              variant="outlined"
              InputProps={{
              readOnly: true,
              }}
              helperText= {this.props.similarityDNN ? "Similarity Score: " + this.props.scoreDNN : "Comparison Inactive"}
              value={this.props.loadingDNN ? "loading..." : this.props.responseDNN} 
          />
          {/* <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={this.props.choice}
          onChange={this.props.handleChoice.bind(this)}
          name="choice"
          style={{marginTop:'5px'}}
          >
          <MenuItem disabled value="recommended questions">--Recommended Questions--</MenuItem>
          {this.props.reccommendation.map((options,i)=>{
              return(
              <MenuItem key={i} value={options.question}>{options.question}</MenuItem>
              );
          }) 

          }
          
          </Select> */}
        </FormControl>

      </div>
    );
  }
}

export default DNN