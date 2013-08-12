var serverAddress;
var viewingUser;
var query;
var alreadyFetchingFeed = false;

window.onload = function() {
	init();
	displayPage();
	var intervalID = setInterval(function() {
		fetchNewFeed();
	}, 3000);

	$(function() {
		$("#search").autocomplete({
			minLength: 2,
			source: serverAddress + "search/users"
		});
	});

	$('#followingDiv').scroll(function() {
		var myDiv = $('#followingDiv')[0];
		if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
			fetchFollowing(parseInt(viewingUser.userid));
		}
	});
	$('#followersDiv').scroll(function() {
		var myDiv = $('#followersDiv')[0];
		if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
			fetchFollowers(parseInt(viewingUser.userid));
		}
	});

};

var init = function() {
	serverAddress = "http://localhost:8080/";
}

window.onhashchange = function() {
	detectURL();
}

var displayPage = function() {
	console.log("Displaying")
	if (loggedIn()) {
		displayLoggedIn();
		detectURL();
	} else displayLoggedOut();
}

var setInfiniteScroll = function(action) {
	if (action == "feed") {
		window.onscroll = function(ev) {
			if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight) {
				console.log("Fetching feed");
				fetchFeed(localStorage.lastTweet);
			}
		};
		return;
	}
	if (action == "profile") {
		window.onscroll = function(ev) {
			if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight) {
				console.log("Fetching User Posts!");
				fetchTweets(viewingUser.userid, viewingUser.posts[viewingUser.posts.length-1].tweetid)
			}
		};
		return;
	}
}

var detectURL = function() {
	var path = window.location.hash.split('#')[1];
	if (path == undefined) {
		displayHomePage();
		return;
	}
	path = path.split(/\?|\//);
	if (path[0] == "users") displayProfile(path[1]);
	else if (path[0] == "search") {
		displayHomePage();
		displaySearch();
	} 
	else if (path[0] == "profile") {
		displayProfile(localStorage.username);
	}
	else displayHomePage();
}

var displaySearch = function() {
	$('#userPosts').hide();
	$('#newsFeed').hide();
	query = decodeURI(window.location.hash.split('#')[1].split(/\?|\//)[1].substring(2));
	searchFunction(query);
}

var displayLoggedIn = function() {
	$('#navBarLoggedOut').hide();
	$('#navBarLoggedIn').show();
	$('#loginDiv').hide();
	$('#splash').hide();
	$('#registerationDiv').hide();
}

var displayHomePage = function() {
	clearSidebar();
	viewingUser = JSON.parse(localStorage.user);
	$('#profileSideBar').slideUp('fast', function() {
		fetchFollowing(localStorage.userid);
		fetchFollowers(localStorage.userid);
		fetchFeed();
		renderProfileSideBar(viewingUser);
	});
	$('#searchResults').hide();
	$('#userPosts').slideUp('fast');
	$('#profileSideBar').slideDown('slow');
	$('#tweetForm').slideDown('slow');
	$('#newsFeed').show();
	$('#tweetForm').show();
	$('#followButton').hide();
	fetchFollowingCount(parseInt(localStorage.userid))
	fetchFollowersCount(parseInt(localStorage.userid))
	setInfiniteScroll("feed");
}

var displayLoggedOut = function() {
	$('#searchResults').hide();
	$('#newsFeed').hide();
	$('#navBarLoggedIn').hide();
	$('#navBarLoggedOut').show();
	$('#registerationDiv').show();
	$('#loginDiv').show();
	$('#splash').show();
	$('#profileSideBar').hide();
}