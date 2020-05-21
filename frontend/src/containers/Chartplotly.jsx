import React, { useRef } from 'react';
import Plot from 'react-plotly.js';

export default function SplineChart(props){

  let chart = useRef();
  let xData = []
  let yData = []
  
  props.responseScoreArray.map((s, i)=>{
    return(
    xData.push(i+1),
    yData.push(s)
    )
  })
  const trace = {
    x: xData,
    y: yData,
    type: "scatter",
    mode: 'lines+markers',
    marker: {color: 'blue'},
    name: props.chatbot,
    showlegend:true
  }
  
  return (
    <div className="App">
    <Plot
      data ={[trace]}
      layout={{width: 550, height: 550, title: 'Similarity Threshold'}}
      onRef={ref => (chart.current = ref)}
    />
    </div>
  );

}                        