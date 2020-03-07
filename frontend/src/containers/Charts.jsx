import React, { useRef } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
// class SplineChart extends Component {
// 	render() {
// 		let chart = useRef();
// 		let responseData = []
// 		this.props.responseScoreArray.map((s, i)=>{
// 			return(
// 			responseData.push({label: i+1, y: s})
// 			)
// 		})

		// const options = {
        //     animationEnabled: true,
        //     backgroundColor: "transparent",
		// 	axisX: {
		// 		valueFormatString: "MMM"
		// 	},
		// 	axisY: {
		// 		title: "Similarity Threshold",
		// 		includeZero: false
		// 	},
		// 	data: [{
		// 		yValueFormatString: "##.00",
        //         type: "spline",
        //         name: "Dialogflow",
		// 		dataPoints: responseData
        //     }
        //     ]
		// }
		
// 		return (
// 		<div>
// 			<CanvasJSChart options = {options} key={responseData.toString()}
// 				onRef={ref => chart.current = ref} 
// 			/>
// 			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
// 		</div>
// 		);
// 	}
// }

export default function SplineChart(props){

		let chart = useRef();
		let responseData = []
		
		props.responseScoreArray.map((s, i)=>{
			return(
			responseData.push({label: i+1, y: s})
			)
		})
		
		const options = {
            animationEnabled: true,
            backgroundColor: "transparent",
			axisX: {
				valueFormatString: "MMM"
			},
			axisY: {
				title: "Similarity Threshold",
				includeZero: false
			},
			data: [{
				yValueFormatString: "##.00",
                type: "spline",
                name: "Dialogflow",
				dataPoints: responseData
            }
            ]
		}
	  
		return (
		  <div className="App">
			<CanvasJSChart
			  key={responseData.toString()}
			  options={options}
			  onRef={ref => (chart.current = ref)}
			/>
		  </div>
		);

}                        