var grabbedArticle = {
  articleContent: "",
  paragraphs: [],
  title: "",
  html: "",
  shortPublication: "",
  fullPublication: "",
  teamID: "",
  fileName: "",
  createdAt: moment().toISOString(),
  userFullName: "",
  shortDate: "",
  formattedDate: "",
  author: ""
};

var alchemyAPIKey = "21f7f90fb3ae48659e29e3f75ebbfe19a0e1df69";
var diffbotAPIKey = "a6a9ac1aedea1a1d9269257972382bbd";
var aylienAPIKey = {
	appId: "57453c5f",
	key: "a26bcf0c8edb28a2e9f3f3814d46b6ce"
}

function getAuthor(url, callback){
	var x = new XMLHttpRequest();
	x.open('GET', 'https://api.aylien.com/api/v1/extract?url='+url);
	x.setRequestHeader('X-AYLIEN-TextAPI-Application-Key', aylienAPIKey.key);
	x.setRequestHeader('X-AYLIEN-TextAPI-Application-ID', aylienAPIKey.appId);
	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200){
			callback(true, JSON.parse(x.responseText).author);
		}
	}
	x.send();
}

function getSummary(text,title, callback) {
	var x = new XMLHttpRequest();
	x.open('GET', 'https://api.aylien.com/api/v1/summarize?text='+text+"&sentences_number=3"+"&title="+title);
	x.setRequestHeader('X-AYLIEN-TextAPI-Application-Key', aylienAPIKey.key);
	x.setRequestHeader('X-AYLIEN-TextAPI-Application-ID', aylienAPIKey.appId);
	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200){
			callback(true, JSON.parse(x.responseText).sentences);
		}
	}
	x.send();
}

function currentTabUrl (callback) {
	chrome.tabs.query({
		active: true,
		currentWindow: true
	},
	function(tabs){
		var url = tabs[0].url;
		console.assert(typeof url == 'string', 'tab.url should be a string');
		callback(url);
	});
}

function getEncodedData(data){
	var urlEncodedData = "";
	var urlEncodedDataPairs = [];
	var name;
	for(name in data) {
		urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
	}
	urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
	return urlEncodedData;
}

function urlToFileCode (url){
	var properties = Object.getOwnPropertyNames(sources);;
	
	for(var i = 0; i<properties.length; i++){
		if(url.indexOf(properties[i]) > 0){
			return {
				short: sources[properties[i]],
				long: sourcesFullName[properties[i]]
			}
		} 
	}

	return {
		short: urlDomain(url),
		long: urlDomain(url)
	}
}

function urlDomain(url) {;
	var uri = new URI(url);
	return uri.domain();
}

function articleDate (htmlContent, callback) {
	var x = new XMLHttpRequest();
	x.open('POST', 'http://gateway-a.watsonplatform.net/calls/html/HTMLGetPubDate');
	x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	x.onreadystatechange = function() {//Call a function when the state changes.
		if(x.readyState == 4 && x.status == 200){
			var date = moment(JSON.parse(x.response).publicationDate.date);
			if(date.isValid()){
				grabbedArticle.formattedPubDate = date.format("MMMM D, YYYY");
				callback(true, date.format("YYMMDD"))
			} else {
				callback(true, "");
			}
		}
	}
	x.onerror = function() {
		callback(false, x.statusText);
	};
	x.send(getEncodedData({
		"apikey": alchemyAPIKey,
		"html": htmlContent,
		"outputMode": "json"
	}));
}

function articleContent (htmlContent, callback) {
	var x = new XMLHttpRequest();
	x.open('POST', 'http://gateway-a.watsonplatform.net/calls/html/HTMLGetText');
	x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	x.onreadystatechange = function(){
		if(x.readyState == 4 && x.status == 200) callback(true, JSON.parse(x.responseText));
	}
	x.onerror = function(){
		callback(false, x.statusText);
	}
	x.send(getEncodedData({
		"apikey": alchemyAPIKey,
		"html": htmlContent,
		"outputMode": "json"
	}));
}

function articleTitle (url, callback) {
	var x = new XMLHttpRequest();
	x.open('POST', 'http://gateway-a.watsonplatform.net/calls/url/URLGetTitle');
	x.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200) callback(true, JSON.parse(x.responseText));
	}
	x.onerror = function () {
		callback(false, x.statusText);
	}		
	x.send(getEncodedData({
		"apikey": alchemyAPIKey,
		"url": url,
		"outputMode": "json"
	}));
}

function articleParagraphs (content) {
	var paragraphs = [];
	for (var i = 0; i < content.split('\n').length; i++) {
		paragraphs.push({"paragraphContent": content.split('\n')[i]});
	};
	return paragraphs;
}

function retrieveArticleData(url, htmlContent, callback) {
	var x = new XMLHttpRequest();
	
	x.open('POST', 'http://api.diffbot.com/v3/article?'+getEncodedData({
			"token": diffbotAPIKey,
			"url": url
	}));

	x.setRequestHeader('Content-Type', 'text/html');

	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200){
			callback(true, JSON.parse(x.responseText).objects);
		}
	}

	x.onerror = function () {
		callback(false, x.statusText);
	}

	x.send(htmlContent)
}

function articleFilename() {
	if(!grabbedArticle.shortDate) return grabbedArticle.shortPublication + " - " + grabbedArticle.title.replace(":", "").replace("?", "").replace("|", "") + ".docx";
	else return grabbedArticle.shortDate + " " + grabbedArticle.shortPublication + " - " + grabbedArticle.title.replace(":", "").replace("?", "").replace("|", "") + ".docx";
}

function saveArticle() {
	JSZipUtils.getBinaryContent('templates/extempfile.docx', function(err, content){
		var file = new wordtemplater(content);
		file.setData(grabbedArticle);
		file.render();
		var output = file.getZip().generate({type:'blob'});
		chrome.downloads.download({
			url: URL.createObjectURL(output),
			filename: grabbedArticle.fileName,
			saveAs: true
		})
	});
}

function scriptMessageExecute (request,sender,ctxt,user) {
	if(request.action == 'getSource'){
		ctxt.refs.fileButton.className += " disabled"
		ctxt.refs.fileButton.setAttribute('disabled', 'disabled');
		ctxt.refs.fileButton.innerHTML = "Filing! Please wait...";
		grabbedArticle.teamID = user.teamID;
		grabbedArticle.userFullName = user.fullName;
		grabbedArticle.html = request.source;
		currentTabUrl(function (url) {
			retrieveArticleData(url, grabbedArticle.html, function (success, result) {
				if(!success) console.error('Error' + result);
				else {
					grabbedArticle.title = result[0].title;
					grabbedArticle.shortDate = moment(result[0].date).format('YYMMDD') || "";
					grabbedArticle.formattedPubDate = moment(result[0].date).format('MMMM DD, YYYY') || "Unknown Publication Date";
					grabbedArticle.articleContent = result[0].text;
					grabbedArticle.author = result[0].author || "Unknown Author";
					grabbedArticle.shortPublication = urlToFileCode(url).short;
					grabbedArticle.fullPublication = urlToFileCode(url).long;
					grabbedArticle.fileName = articleFilename();
					grabbedArticle.paragraphs = articleParagraphs(grabbedArticle.articleContent);
					submitArticle(grabbedArticle, function(success, result) {
						if(success){
							if(!result.result){
								ctxt.refs.alert.style.display = "block";
								ctxt.refs.alertText.innerHTML = result.errMessage;
								ctxt.refs.fileButton.className.replace(' disabled', '');
								ctxt.refs.fileButton.removeAttribute('disabled');
								ctxt.refs.fileButton.innerHTML = "File this article";
							}else {
								ctxt.refs.fileButton.className.replace(' disabled', '');
								ctxt.refs.fileButton.removeAttribute('disabled');
								ctxt.refs.fileButton.innerHTML = "File this article";
								saveArticle();
							}
						}
					});		
				}
			});
		});
	}
}

function onScriptMessage (request, sender,ctxt,user) {
	if(request.action == 'getSource'){
		grabbedArticle.teamID = user.teamID;
		grabbedArticle.userFullName = user.fullName;
		grabbedArticle.html = request.source;
		var temp = $(grabbedArticle.html).find('.last-update').remove().end().prop('outerHTML');
		console.log(temp);
		grabbedArticle.html = temp;
		articleContent(grabbedArticle.html, function (success, result) {
			if(success) {
				grabbedArticle.articleContent = result.text;
				grabbedArticle.paragraphs = articleParagraphs(grabbedArticle.articleContent);
				currentTabUrl(function (url) {
					articleTitle(url, function (success, result) {
						if(success){
							grabbedArticle.title = result.title;
							grabbedArticle.fileName = grabbedArticle.title;
							articleDate(grabbedArticle.html, function (success, result) {
								grabbedArticle.shortDate = result;
								var fileCodes = urlToFileCode(url);
								grabbedArticle.shortPublication = fileCodes.short;
								grabbedArticle.fullPublication = fileCodes.long;
								grabbedArticle.fileName = result + " " + grabbedArticle.shortPublication + " - " + grabbedArticle.title.replace(":", "").replace("?", "").replace("|", "") + ".docx";
								getAuthor(url, function(success, result){
									grabbedArticle.author = result;
									//getSummary(grabbedArticle.articleContent, grabbedArticle.title, function(success, result){
										grabbedArticle.summary = result;
										// submitArticle(grabbedArticle, function(success, response){
										// 	if(!result){
										// 		ctxt.refs.alert.style.display = "block";
										// 		ctxt.refs.alertText.innerHTML = result.errMessage;
										// 		ctxt.refs.fileButton.className.replace(' disabled', '');
										// 		ctxt.refs.fileButton.removeAttribute('disabled');
										// 		ctxt.refs.fileButton.innerHTML = "File this article";
										// 	}else {
										// 		ctxt.refs.fileButton.className.replace(' disabled', '');
										// 		ctxt.refs.fileButton.removeAttribute('disabled');
										// 		ctxt.refs.fileButton.innerHTML = "File this article";
										// 		saveArticle();
										// 	}
										//});
									//});
								});
							})
						}
					})
				})
			}
		})
	}
}
