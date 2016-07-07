import React from 'react'
import { Pie } from 'react-chartjs'
import { Panel } from 'react-bootstrap'
import PieLegend from './legend.jsx'

class PieWithLegend extends React.Component {
	constructor(props){
		super(props)
		this.state = {};
		this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this);
	}
	shouldComponentUpdate(){
		return true;
	}

	render(){
		var pieData = this.props.isTeam ? this.props.data.teamSourcesPie : this.props.data.mySourcesPie;

		if(!this.props.isTeam && this.props.data.mySourcesPie.length == 0){
			return (<Panel><strong>No data yet!</strong></Panel>)
		}else if(this.props.isTeam && this.props.data.teamSourcesPie.length == 0){
			return (<Panel><strong>No data yet!</strong></Panel>)
		}else {
			return (
				<div style={{display: "flex", "marginTop": "15px", height: "215px"}}>
					<div style={{alignSelf: "center"}}>
						<Pie data={pieData} width={200} height={200} redraw/>
					</div>
					<div style={{float: "right", marginLeft: "15px", "overflow": "scroll"}}>
						<Panel style={{width: "133px"}}><PieLegend dataSet={pieData}/></Panel>
					</div>
				</div>
			)	
		}
	}
}

export default PieWithLegend