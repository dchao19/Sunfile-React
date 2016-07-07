import React from 'react'

class WelcomeScreen extends React.Component {
	constructor(props){
		super(props);
		this.loginButton = this.loginButton.bind(this);
		this.registerButton = this.registerButton.bind(this);
	}

	loginButton(){
		this.context.router.push("/login");
	}

	registerButton(){
		this.context.router.push("/register");
	}

	render(){
		return (
			<div style={{height: "auto"}}>
				<h3>Welcome!</h3>
				<p>We need you to log in or sign up. Then you'll choose a team if you haven't already.</p>
				<button className="btn btn-primary btn-lg btn-block" id="goLoginScreen" onClick={this.loginButton}>Log in</button>
				<button className="btn btn-default btn-lg btn-block" id="goRegisterScreen" onClick={this.registerButton}>Sign up</button>
			</div>
		)
	}
};
WelcomeScreen.contextTypes = {
	router: React.PropTypes.object.isRequired
}
export default WelcomeScreen