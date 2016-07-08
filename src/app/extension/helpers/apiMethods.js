var isDev = true;
API_URL = isDev ? 'http://localhost:3000/api' : 'https://sunfile.danielchao.me/api'
function isLoggedIn (callback) {
	var x = new XMLHttpRequest();
    x.withCredentials = true;
    x.open('GET', API_URL + '/auth/testAuth');

    x.onreadystatechange = function(){
        if(x.readyState == 4 && x.status == 200) {
        	var response = JSON.parse(x.responseText);
        	callback(true, response);
        }
        if(x.readyState == 4 && x.status == 401) callback(false, null);
    }
    x.onerror = function(){
 		callback(false, x.statusText);
    }
    x.send();
}

function hasTeam (callback) {
	var x = new XMLHttpRequest();
	x.withCredentials = true;
	x.open('GET', API_URL + '/teams/checkuser');
	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200){
			var response = JSON.parse(x.responseText);
			if(response.result) callback(true, response.result);
        	else callback(false, response.errMessage)
		}
	}
	x.onerror = function () {
		callback(false, x.statusText);
	}

	x.send();
}

function getSources(){
	var x = new XMLHttpRequest();
	x.withCredentials = true;
	x.open('GET', API_URL+"/sources");
	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200) {
			sources = JSON.parse(x.responseText).result.sources;
			sourcesFullName = JSON.parse(x.responseText).result.sourcesFullName;
		}
	}
	x.send()
}

function executeLogin(username, password, callback){
	var x = new XMLHttpRequest();
	x.withCredentials = true;
	x.open('POST', API_URL + '/auth/login');
    x.setRequestHeader("Content-type", "application/json");
    x.onreadystatechange = function() {//Call a function when the state changes.
    	if(x.readyState == 4 && x.status == 200) callback(true, null);
    	else if(x.readyState == 4 && x.status == 401) callback(false, "Incorrect username or password");
    }

    x.onerror = function() {
    	callback(false, x.statusText);
    };
    
    x.send(JSON.stringify({
    	"username":username, 
    	"password":password,
    }));
}

function executeTeamJoin(teamId, callback){
	var x = new XMLHttpRequest();
	x.withCredentials = true;
	x.open('POST', API_URL + '/teams/adduser');
	x.setRequestHeader('Content-Type', 'application/json');
	x.onreadystatechange = function(){
		if(x.readyState == 4 && x.status == 200){
			var response = JSON.parse(x.responseText);
			if(response.errMessage) callback(false, response.errMessage);
			else callback(true, response.result);
		}
	}
	x.onerror = function(){
		callback(false, x.statusText);
	}
	x.send(JSON.stringify({
		"teamId": teamId
	}));
}

function executeTeamCreate(contactEmail, teamName, callback){
	var x = new XMLHttpRequest();
	x.withCredentials = true;
	x.open('POST', API_URL + '/teams/new');
	x.setRequestHeader('Content-Type', 'application/json');
	x.onreadystatechange = function(){
		if(x.readyState == 4 & x.status == 200){
			var response = JSON.parse(x.responseText);
			if(response.errMessage) callback(false, response.errMessage);
			else callback(true, response);
		}
	}
	x.onerror = function(){
		callback(false, x.statusText);
	}
	x.send(JSON.stringify({
		"contactEmail": contactEmail,
		"schoolName": teamName
	}))
}

function executeRegister(firstname, lastname, username, password, callback){
	var x = new XMLHttpRequest();
	x.withCredentials = true;
	x.open('POST', API_URL + '/auth/register');
	x.setRequestHeader('Content-Type', 'application/json');
	x.onreadystatechange = function(){
		if(x.readyState == 4 && x.status == 200){
			var response = JSON.parse(x.responseText);
			if(response.errMessage) callback(false, response.errMessage);
			else callback(true, response);
		}
	}
	x.onerror = function(){
		callback(false, x.statusText);
	}
	x.send(JSON.stringify({
		"username": username,
		"firstName": firstname,
		"lastName": lastname,
		"password": password
	}));
}

function submitArticle (grabbedArticle, callback) {
	var x = new XMLHttpRequest();
	x.withCredentials = true;
	x.open('POST', API_URL + '/article/new');
	x.setRequestHeader('Content-Type', 'application/json');

	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200){
			var response = JSON.parse(x.responseText);
			callback(true, response);
		}
	}

	x.onerror = function () {
		callback(false, x.statusText);
	}

	var article = {
		title: grabbedArticle.title,
		teamID: grabbedArticle.teamID,
		fullPublication: grabbedArticle.fullPublication,
		shortPublication: grabbedArticle.shortPublication,
		articleContent: grabbedArticle.articleContent
	}

	x.send(JSON.stringify(article))
}

