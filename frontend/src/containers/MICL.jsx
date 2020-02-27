import React,{Component} from 'react';
import TextField from '@material-ui/core/TextField';
// import Select from '@material-ui/core/Select';
// import MenuItem from '@material-ui/core/MenuItem';
// import FormControl from '@material-ui/core/FormControl';

const textFieldOutput={width:'400px'};
const textFieldsuccess={width:'400px',border:'1px solid #00ff00'};
const textFielderror={width:'400px',border:'1px solid #ff0000'};
// const form={width:'400px'};

class MICL extends Component{
  
  render(){
    
    return (
        
      <div>
        <TextField
            id="outlined-multiline-static"
            label="MICL"
            multiline
            rows="10"
            variant="filled"
            InputProps={{
            readOnly: true,
            }}
            style={this.props.similarityMICL ? textFieldsuccess: this.props.disimilarityMICL ? textFielderror: textFieldOutput}
            value={this.props.loadingMICL ? "loading..." : this.props.responseMICL} 
        />
        {/* <FormControl variant="outlined" style={form}>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={this.props.choice}
            onChange={this.props.handleChoice.bind(this)}
            name="choice"
            >
            <MenuItem disabled value="recommended questions">--Recommended Questions--</MenuItem>
            {this.props.reccommendation.map((options,i)=>{
                return(
                <MenuItem key={i} value={options.question}>{options.question}</MenuItem>
                );
            }) 

            }
            
            </Select>
        </FormControl> */}

      </div>
    );
  }
}

export default MICL