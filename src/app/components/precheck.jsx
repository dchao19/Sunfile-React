import React from 'react'

class PreChecker extends React.Component {
	constructor(props){
		super(props);
		this.componentDidMount = this.componentDidMount.bind(this);
		this.checkLogin = this.checkLogin.bind(this);
		this.checkTeam = this.checkTeam.bind(this);
	}
	componentDidMount(){
		this.checkLogin();
	}
	checkLogin(){
		var ctxt = this;
		var x = new XMLHttpRequest();
		x.withCredentials = true;
		x.open('GET',  API_URL + '/sources');
		x.onreadystatechange = function(){
			if(x.readyState == 4 && x.status == 200){
				var response = JSON.parse(x.responseText);
				sources = response.result.sources;
				sourcesFullName = response.result.sourcesFullName;
				isLoggedIn(function(success, result){
					if(!success) ctxt.context.router.push('/welcome');
					else ctxt.checkTeam();
				});
			}
		}
		x.send();
	}
	checkTeam(){
		var ctxt = this;
		hasTeam(function (success, result) {
			if(success) ctxt.context.router.push('/portal');
			else ctxt.context.router.push('/teamselection')
		})
	}
	render(){
		return (<h3>Initalizing</h3>)
	}
}

PreChecker.contextTypes = {
	router: React.PropTypes.object.isRequired
}

export default PreChecker