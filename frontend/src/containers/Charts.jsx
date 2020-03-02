import React, { Component } from 'react';
import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
 
class SplineChart extends Component {
	render() {
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
				dataPoints: [
					{ label: 1, y: 0.74 },
					{ label: 2, y: 0.63 },
					{ label: 3, y: 0.57 },
					{ label: 4, y: 0.76 },
					{ label: 5, y: 0.44 },
					{ label: 6, y: 0.79 },
					{ label: 7, y: 0.8 },
					{ label: 8, y: 0.67 },
					{ label: 9, y: 0.77 },
					{ label: 9, y: 0.67 },
					{ label: 10, y: 0.84 },
				]
            },
            {
				yValueFormatString: "##.00",
                type: "spline",
                name: "MICL",
				dataPoints: [
                    { label: 1, y: 0.65 },
					{ label: 2, y: 0.34 },
					{ label: 3, y: 0.55 },
					{ label: 4, y: 0.44 },
					{ label: 5, y: 0.53 },
					{ label: 6, y: 0.78 },
					{ label: 7, y: 0.66 },
					{ label: 8, y: 0.49 },
					{ label: 9, y: 0.68 },
					{ label: 9, y: 0.75 },
					{ label: 10, y: 0.76 },
				]
            },
            
            ]
		}
		
		return (
		<div>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default SplineChart;                           