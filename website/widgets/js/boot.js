//
_$ = {};
_$.global = {};
_$.fetch = {};
_$.post = {};
_$.render = {};
_$.render.push = {};
_$.authentication = {};
_$.utils = {};
_$.display = {};
_$.global.serverAddress;
_$.global.viewingUser;
_$.global.query;
_$.global.hashtag;
_$.global.alreadyFetchingFeed = false;

window.onload = function() {
	_$.utils.init();
	_$.display.page();
	var intervalID = setInterval(function() {
		_$.fetch.newFeed();
	}, 3000);

	$(function() {
		$("#search").autocomplete({
			minLength: 2,
			delay:500,
			source: _$.global.serverAddress + "search/users"
		});
	});

	$('#followingDiv').scroll(function() {
		var myDiv = $('#followingDiv')[0];
		if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
			_$.fetch.following(parseInt(_$.global.viewingUser.userid));
		}
	});
	$('#followersDiv').scroll(function() {
		var myDiv = $('#followersDiv')[0];
		if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
			_$.fetch.followers(parseInt(_$.global.viewingUser.userid));
		}
	});

};

_$.utils.init = function() {
	_$.global.serverAddress = "http://localhost:8080/";
}

window.onhashchange = function() {
	_$.utils.detectURL();
}

_$.utils.setInfiniteScroll = function(action) {
	if (action == "feed") {
		window.onscroll = function(ev) {
			if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight) {
				console.log("Fetching feed");
				_$.fetch.feed(localStorage.lastTweet);
			}
		};
		return;
	}
	if (action == "profile") {
		window.onscroll = function(ev) {
			if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight) {
				console.log("Fetching User Posts!");
				_$.fetch.tweets(_$.global.viewingUser.userid, _$.global.viewingUser.posts[_$.global.viewingUser.posts.length-1].tweetid);
			}
		};
		return;
	}
	if (action == "search") {
		window.onscroll = function(ev) {
			if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight) {
				console.log("Fetching Search Results!");
				_$.utils.searchFunction(_$.global.query, search.result[search.result.length-1].tweetid);
			}
		};
		return;
	}
}

_$.utils.detectURL = function() {
	var path = window.location.hash.split('#')[1];
	if (path == undefined) {
		document.getElementById('navProfileButon').setAttribute("class","");
		document.getElementById('navHomeButon').setAttribute("class","active");
		_$.display.homePage();
		return;
	}
	path = path.split(/\?|\//);
	if (path[0] == "users") _$.display.profile(path[1]);
	else if (path[0] == "search") {
		_$.display.homePage();
		_$.display.search();
	} 
	else if (path[0] == "profile") {
		document.getElementById('navProfileButon').setAttribute("class","active");
		document.getElementById('navHomeButon').setAttribute("class","");
		_$.display.profile(localStorage.username);
	}
	else if (path[0] == "hashtag") {
		_$.display.homePage();
		_$.global.hashtag = path[1];
		_$.display.hashTag();
	}
	else _$.display.homePage();
}
