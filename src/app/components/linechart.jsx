import React from 'react'
import { Line } from 'react-chartjs'

class LineChart extends React.Component {
	constructor(props){
		super(props);
	
	}
	render(){
		var data = this.props.isTeam ? this.props.data.teamArticlesLine : this.props.data.myArticlesLine;
		return(<Line data={data} width={350} height={200} redraw/>)
	}
}

export default LineChart