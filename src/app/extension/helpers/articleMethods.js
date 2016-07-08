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


function getSummary(text, title, callback) {
	var x = new XMLHttpRequest();
	x.open('POST', API_URL + '/article/summary');
	x.setRequestHeader('Content-Type', 'application/json');
	x.onreadystatechange = function () {
		if(x.readyState == 4 && x.status == 200){
			callback(true, JSON.parse(x.responseText).result.summary);
		} else if (x.readyState == 4) {
			callback(false, JSON.parse(x.responseText).sentences)
		}
	}
	x.send(JSON.stringify({
		text: text,
		title: title
	}));
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
	var properties = Object.getOwnPropertyNames(sources);
	
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


function retrieveArticleData(html, callback) {
	var x = new XMLHttpRequest();
	x.open('POST', API_URL+'/article/content');
	x.setRequestHeader("Content-Type", "text/html");
	x.onreadystatechange = function() {
		if(x.readyState == 4 && x.status == 200) callback(true, JSON.parse(x.responseText).result);
	}
	x.onerror = function(){
		callback(false, x.statusText);
	}
	x.send(html);
}


function articleFilename() {
	if(!grabbedArticle.shortDate) return grabbedArticle.shortPublication + " - " + grabbedArticle.title.replace(":", "").replace("?", "").replace("|", "") + ".docx";
	else return grabbedArticle.shortDate + " " + grabbedArticle.shortPublication + " - " + grabbedArticle.title.replace(":", "").replace("?", "").replace("|", "") + ".docx";
}

function saveArticle() {
	JSZipUtils.getBinaryContent('templates/extempfilewithsummary.docx', function(err, content){
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


function onScriptMessage (request, sender, ctxt, user) {
	if(request.action == 'getSource'){
		grabbedArticle.teamID = user.teamID;
		grabbedArticle.userFullName = user.fullName;
		grabbedArticle.html = request.source;
		var jQueryObject = $('<div/>').html(grabbedArticle.html);
		var temp = jQueryObject.find('.last-update').remove().end().find('.fyre').remove().end().find('style,script').remove().end().html();
		grabbedArticle.html = temp;
		retrieveArticleData(grabbedArticle.html, function(success, result) {
			if (success) {
				grabbedArticle.articleContent = result.text;
				grabbedArticle.author = result.author;
				grabbedArticle.paragraphs = result.paragraphs;
				grabbedArticle.title = result.title;
				grabbedArticle.formattedPubDate = moment(result.pubDate).format("MMMM D, YYYY");
				grabbedArticle.shortDate = moment(result.pubDate).format("YYMMDD");
				grabbedArticle.tags = result.keywords;
				currentTabUrl(function (url) {
					var fileCodes = urlToFileCode(url);
					grabbedArticle.shortPublication = fileCodes.short;
					grabbedArticle.fullPublication = fileCodes.long;
					grabbedArticle.fileName = articleFilename();
					getSummary(grabbedArticle.articleContent, grabbedArticle.title, function(success, result) {
						if (success) {
							grabbedArticle.summary = result;
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
		});
	}
}
