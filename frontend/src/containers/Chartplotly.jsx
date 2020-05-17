import React, { Component } from 'react';
import Plot from 'react-plotly.js';

class plotly extends Component {
  render() {
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
          }        
        ]}
        layout={{width: 500, height: 500, title: 'Comparison'}}
      />
    );
  }
}

export default plotly