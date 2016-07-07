import React from 'react'
import { Link } from 'react-router'

class TeamSelection extends React.Component {
	constructor(props){
		super(props);
		this.joinTeam = this.joinTeam.bind(this);
	}

	joinTeam(){
		var ctxt = this;
		executeTeamJoin(this.refs.teamIDInput.value, function(success, result){
			if(!success){
				ctxt.refs.error.style.display = "block";
				ctxt.refs.errorText.innerHTML = result;
			}else {
				console.log("Setup complete!");
				ctxt.context.router.push('/portal');
			}
		});
	}

	render(){
		return (
			<div>
				<h3>Join or create a team</h3>
				<p>If your coach or captain has already created a team, enter the code here. If not, create a new team.</p>
				<div className="alert alert-danger" role="alert" ref="error" style={{"display": "none"}}>
  					<strong>Oh no!</strong> <span ref="errorText">blah blah blah</span>
				</div>
				<input type="text" className="form-control joinTeamFromInput" placeholder="team code" ref="teamIDInput"/>
				<button className="btn btn-success btn-block joinButton" onClick={this.joinTeam} style={{"marginTop": "15px"}}>Join Team</button>
				<hr/>
				<Link to="/createteam" className="btn btn-block btn-primary createTeamButton"> I don't have a team code.</Link>
			</div>
		)
	}
}

TeamSelection.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default TeamSelection