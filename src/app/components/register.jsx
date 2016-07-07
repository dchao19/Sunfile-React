import React from 'react';

class RegisterScreen extends React.Component {
	constructor(props){
		super(props);
		this.register = this.register.bind(this);
		this.checkTeam = this.checkTeam.bind(this);
	}

	register(){
		var ctxt = this;
		executeRegister(this.refs.firstName.value, this.refs.lastName.value, this.refs.email.value, this.refs.password.value, function (success, result) {
			if(success) ctxt.checkTeam();
			else {
				ctxt.refs.registerError.style.display = "block";
				ctxt.refs.registerErrorText.innerHTML = result.message.replace('username', 'email') + ".";
			}
		})
	}

	checkTeam(){
		var ctxt = this;
		hasTeam(function (success, result) {
			if(success) ctxt.context.router.push('/router');
			else ctxt.context.router.push('/teamselection');
		})
	}

	render(){
		return (
			<div style={{height: "auto"}}>
				<h3>Welcome <small>Please register for an account.</small> </h3>
				<div className="alert alert-danger" role="alert" ref="registerError" style={{"display": "none"}}>
  					<strong>Oh no!</strong> <span ref="registerErrorText">blah blah blah</span>
				</div>
				<form data-toggle="validator">
					<div className="form-group">
						<input type="text" className="form-control" id="registerFirstName" ref="firstName" placeholder="First Name" name="firstN" required/>
					</div>
					<div className="form-group">
						<input type="text" className="form-control" id="registerLastName" ref="lastName" placeholder="Last Name" name="lastN" required/>
					</div>
					<div className="form-group">
						<input type="email" className="form-control" id="registerEmail" ref="email" placeholder="Email" name="username" required/>
					</div>
					<div className="form-group">
						<input type="password" className="form-control" id="registerPassword" ref="password" placeholder="Password" name="password" required/>
					</div>
					<div className="form-group">
						<input type="password" className="form-control" id="registerConfirmPassword" placeholder="Confirm Password" name="confirmpassword" data-match="#registerPassword" data-match-error="Passwords must match." required/>
						<div className="help-block with-errors"></div>
					</div>
					<div>
						<button className="btn btn-primary" type="button" id="clickRegisterButton" onClick={this.register}>Register</button>
					</div>
				</form>
			</div>
		)
	}
}
RegisterScreen.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default RegisterScreen