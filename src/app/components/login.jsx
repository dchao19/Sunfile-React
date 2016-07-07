import React from 'react'

class LoginScreen extends React.Component{
	constructor(props){
		super(props);
		this.submitLogin = this.submitLogin.bind(this);
		this.checkTeam = this.checkTeam.bind(this);
	}
	submitLogin(){
		var ctxt = this;
		var username = this.refs.loginUsernameInput.value;
		var password = this.refs.loginPasswordInput.value;
		executeLogin(username, password, function(success, result){
			if(success)	ctxt.checkTeam();
			else ctxt.refs.incorrectusernamepasswordalert.style.display = "block";
		});
	}
	checkTeam(){
		var ctxt = this;
		hasTeam(function (success, result) {
			if(success)	ctxt.context.router.push('/portal');
			else ctxt.context.router.push('/teamselection');
		})
	}
	render () {
		return (
			<div>
				<h3>Welcome <small>Please log in.</small> </h3>
				<div className="alert alert-danger" role="alert" ref="incorrectusernamepasswordalert" style={{display: "none"}}>
  					<strong>Oh no!</strong> Incorrect username or password.
				</div>
				<form data-toggle="validator">
					<div className="form-group">
						<input type="email" className="form-control" placeholder="Email" ref="loginUsernameInput" data-error="Invalid Email Address" required/>
						<div className="help-block with-errors"></div>
					</div>
					<div className="form-group">
						<input type="password" className="form-control" placeholder="Password" ref="loginPasswordInput" required/>
					</div>
					<div>
						<button className="btn btn-primary" type="button" ref="clickLoginButton" onClick={this.submitLogin}>Sign in</button>
					</div>
				</form>
			</div>
		)
	}
}

LoginScreen.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default LoginScreen