import React from 'react';
import {render} from 'react-dom';
import {Router, Route, Link, hashHistory} from 'react-router';
import WelcomeScreen from './components/welcome.jsx';
import LoginScreen from './components/login.jsx';
import PreChecker from './components/precheck.jsx';
import RegisterScreen from './components/register.jsx';
import TeamSelection from './components/teamselection.jsx';
import TeamCreation from './components/createteam.jsx';
import Portal from './components/portal.jsx';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	render() {
		return (
			<Router history={hashHistory}>
				<Route path="/" component={PreChecker} />
				<Route path="/welcome" component={WelcomeScreen}/>
				<Route path="/login" component={LoginScreen}/>
				<Route path="/register" component={RegisterScreen}/>
				<Route path="/teamselection" component={TeamSelection}/>
				<Route path="/createteam" component={TeamCreation}/>
				<Route path="/portal" component={Portal}/>
			</Router>
		)
	}
}

render(<App/>, document.getElementById('app'));

