import React from 'react';
import {Nav, NavItem, NavDropdown} from 'react-bootstrap';
import Stats from './statistics.jsx';

class Portal extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			selectedScreen: "stats",
			activeKey: 1,
			isTeam: false,
			teamID: "",
			fullName: "",
		}
		this.fileArticle = this.fileArticle.bind(this);
		this.navSelect = this.navSelect.bind(this);
		this.navSelect = this.navSelect.bind(this);
		this.componentWillMount = this.componentWillMount.bind(this);
	}

	componentWillMount(){
		var ctxt = this;
		var x = new XMLHttpRequest();
		x.withCredentials = true;
		x.open('GET', 'https://sunfile.azurewebsites.net/api/stats/userinfo');
		x.onreadystatechange = function(){
			if(x.readyState == 4 && x.status == 200){
				var response  = JSON.parse(x.responseText);
				if(!response.errMessage){
					ctxt.state.teamID = response.result.teamId;
					ctxt.state.fullName = response.result.firstName + " " + response.result.lastName;
					ctxt.state.firstName = response.result.firstName;
					ctxt.forceUpdate();
				}
			}
		}
		x.send();
	}

	fileArticle(){
		var ctxt = this;
		chrome.tabs.executeScript(null, { file: "helpers/getPagesSource.js" }, function() {
			ctxt.refs.fileButton.className += " disabled"
			ctxt.refs.fileButton.setAttribute('disabled', 'disabled');
			ctxt.refs.fileButton.innerHTML = "Filing! Please wait...";
			// If you try and inject into an extensions page or the webstore/NTP you'll get an error
			if (chrome.runtime.lastError) {
				ctxt.refs.alert.style.display = "block";
				ctxt.refs.alertText.innerHTML = "This page cannot be filed!";
				ctxt.refs.fileButton.className = ctxt.refs.fileButton.className.replace(' disabled', '');
				ctxt.refs.fileButton.removeAttribute('disabled');
				ctxt.refs.fileButton.innerHTML = "File this article";
			}
		});

		chrome.runtime.onMessage.addListener(function(request, sender) {
			onScriptMessage(request, sender, ctxt, {
				teamID: ctxt.state.teamID,
				fullName: ctxt.state.fullName
			});
		});
	}

	navSelect(selectedKey){
		switch(selectedKey){
			case 1:
				this.state.selectedScreen = "stats"
				this.state.activeKey = 1;
				this.forceUpdate();
				break;
			case 2.1:
				this.state.selectedScreen = "sources"
				this.state.activeKey = 2;
				this.state.isTeam = false;
				this.forceUpdate();
				break;
			case 2.2:
				this.state.selectedScreen = "sources"
				this.state.activeKey = 2;
				this.state.isTeam = true;
				this.forceUpdate();
				break;
			case 3.1:
				this.state.selectedScreen = "articles"
				this.state.activeKey = 3;
				this.state.isTeam = false;
				this.forceUpdate();
				break;
			case 3.2:
				this.state.selectedScreen = "articles"
				this.state.activeKey = 3;
				this.state.isTeam = true;
				this.forceUpdate();
				break;
			case 4:
				this.state.selectedScreen = "teamStats"
				this.state.activeKey = 4;
				this.forceUpdate();
		}
	}

	render(){
		return (
			<div>
				<h3>Hi {this.state.firstName}!</h3>
				<div className="alert alert-danger" role="alert" ref="alert" style={{"display": "none"}}>
					<strong>Oh no!</strong> <span ref="alertText">blah blah blah</span>
				</div>
				<button className="btn btn-success btn-block" onClick={this.fileArticle} ref="fileButton">File this article</button>
				<Nav bsStyle="tabs" activeKey={this.state.activeKey} onSelect={this.navSelect} style={{marginTop: "15px", marginBottom: "15px"}}>
					<NavItem eventKey={1}>Info</NavItem>
					<NavDropdown eventKey={2} title="Sources" id="sources">
						<NavItem eventKey={2.1}>My Sources</NavItem>
						<NavItem eventKey={2.2}>Team Sources</NavItem>
					</NavDropdown>
					<NavDropdown eventKey={3} title="Articles" id="articles">
						<NavItem eventKey={3.1}>My Articles</NavItem>
						<NavItem eventKey={3.2}>Team Articles</NavItem>
					</NavDropdown>
					<NavItem eventKey={4}>Team</NavItem>
				</Nav>
				<Stats screen={this.state.selectedScreen} isTeam={this.state.isTeam}/>
			</div>
		)
	}
}

Portal.contextTypes = {
	router: React.PropTypes.object.isRequired
}


export default Portal