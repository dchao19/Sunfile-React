import React from 'react'
import { Panel } from 'react-bootstrap'

class TeamStats extends React.Component{
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div style={{overflowY: "scroll", height: "215px"}}>
				{
					this.props.data.teamStats.map(function(userStat, i){
						var articlesPlural = (userStat.numArticles == 1) ? " article" : " articles";
						return(
							<Panel key={i}>
								<span style={{float: "left"}}> <strong> {userStat.name} </strong> </span>
								<span style={{float: "right"}}> {userStat.numArticles + articlesPlural}</span>
							</Panel>
						)
					})
				}	
			</div>
		)
	}
}

export default TeamStats