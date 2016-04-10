import React from 'react';
import { Panel, ButtonGroup, Button } from 'react-bootstrap';
import PieWithLegend from './pielegend.jsx';
import LineChart from './linechart.jsx';
import TeamStats from './teamstats.jsx'

class Stats extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			teamName: "",
			teamCode: "",
			myNumArticles: 0,
			teamNumArticles: 0,
		};
		this.componentDidMount = this.componentDidMount.bind(this);
	}
	componentDidMount(){
		var ctxt = this;
		var x = new XMLHttpRequest();
		x.withCredentials = true;
		x.open('GET', 'https://sunfile.danielchao.me/api/stats/getStats');
		x.onreadystatechange = function(){
			if(x.readyState == 4 && x.status == 200){
				var response  = JSON.parse(x.responseText);
				if(!response.errMessage){
					ctxt.state.response = response.result;
					ctxt.forceUpdate();
				}
			}
		}
		x.send();
	}

	render(){
		if(this.state.response){
			if(this.props.screen === "stats") {
				var myArticlesPlural = (this.state.myNumArticles == 1) ? " article" : " articles";
				var teamArticlesPlural = (this.state.teamNumArticles == 1) ? " article" : " articles";
				return (
					<div>
					<Panel style={{marginTop: "15px"}}>
						<span style={{float: "right", clear: "right"}}><strong>Team Code</strong></span>
						<span style={{float: "left"}}><strong>Team Name</strong></span>
						<span style={{float: "left", clear: "left"}}>{this.state.response.infoStats.teamName}</span>
						<span style={{float: "right", clear: "right"}}>{this.state.response.infoStats.teamCode}</span>	
					</Panel>
					<Panel style={{marginTop: "15px"}}>
						<span style={{float: "left"}}> <strong>My articles this season: </strong></span>
						<span style={{float: "right"}}>{this.state.response.infoStats.myNumArticles + myArticlesPlural}</span>
					</Panel>
					<Panel style={{marginTop: "15px"}}>
						<span style={{float: "left"}}> <strong>Team articles this season: </strong></span>
						<span style={{float: "right"}}>{this.state.response.infoStats.teamNumArticles + teamArticlesPlural}</span>
					</Panel>
					</div>
				)	
			} else if(this.props.screen === "sources"){
				return (<PieWithLegend data={this.state.response} isTeam={this.props.isTeam}/>)			
			} else if(this.props.screen === "articles"){
				return  (
					<div style={{textAlign:"center", marginBottom: "15px"}}>
						<LineChart isTeam={this.props.isTeam} data={this.state.response}/>
					</div>
				)
			} else if(this.props.screen === "teamStats"){
				return (
					<TeamStats data={this.state.response}/>
				)
			}
		}else {
			return (<Panel><strong>Loading data...</strong></Panel>)
		}
	}
}

Stats.pieData = [
		{label: "CSIS", value: 20.0},
		{"label": "CE", value: 30},
		{label: "BBC", value: 10}
]

export default Stats