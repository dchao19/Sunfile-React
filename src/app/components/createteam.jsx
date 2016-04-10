import React from 'react';

class TeamCreation extends React.Component {
	constructor(props){
		super(props);
		this.createTeam = this.createTeam.bind(this);
	}

	createTeam(){
		var ctxt = this;
		executeTeamCreate(this.refs.contactEmail.value, this.refs.schoolName.value, function(success, result){
			if(!success){
				ctxt.refs.error.style.display = "block";
				ctxt.refs.errorText.innerHTML = result;
			}
			else {
				console.log("Setup complete");
				ctxt.context.router.push('/portal');
			}
		});
	}

	render(){
		return (
			<div>
				<h3>Create a team</h3>
				<p>Enter the contact email and the name of the team.</p>
				<div className="alert alert-danger" role="alert" ref="error" style={{"display": "none"}}>
  					<strong>Oh no!</strong> <span ref="errorText">blah blah blah</span>
				</div>
				<input type="email" className="form-control" placeholder="Team Name (ex. Kent Denver School)" ref="schoolName"/>
				<input type="email" className="form-control" placeholder="Coach/Captain/Indiviual Contact Email"  style={{"marginTop": "15px"}} ref="contactEmail"/>
				<button className="btn btn-success btn-block" style={{"marginTop": "15px"}} onClick={this.createTeam}>Create Team</button>
			</div>
		)
	}
}
TeamCreation.contextTypes = {
	router: React.PropTypes.object.isRequired
}
export default TeamCreation