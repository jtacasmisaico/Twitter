
var serverAddress;
var viewingUser;
var query;
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
		console.log("Initiated infinite scroll in following div");
		var myDiv = $('#followingDiv')[0];
		if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
			fetchFollowing(parseInt(viewingUser.userid));
		}
	});
	$('#followersDiv').scroll(function() {
		console.log("Initiated infinite scroll in followers div");
		var myDiv = $('#followersDiv')[0];
		if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
			console.log(viewingUser);
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
}

window.onscroll = function(ev) {
	if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
		fetchFeed(localStorage.tweetsFetched);
	}
};

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