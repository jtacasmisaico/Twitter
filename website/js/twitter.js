//
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
				fetchTweets(viewingUser.userid, viewingUser.posts[viewingUser.posts.length-1].tweetid);
			}
		};
		return;
	}
	if (action == "search") {
		window.onscroll = function(ev) {
			if ((window.innerHeight + window.scrollY + 200) >= document.body.offsetHeight) {
				console.log("Fetching Search Results!");
				searchFunction(query, search.result[search.result.length-1].tweetid);
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
	setInfiniteScroll("search");
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
}//init.js
var displayProfile = function(username) {
    removeAndAddFollowButton();
    $('#searchResults').hide();
    $('#newsFeed').hide();
    $('#tweetForm').slideUp('slow');
    $('#newsFeed').slideUp('slow');
    $('#userPosts').slideDown('slow');
    $('#profileSideBar').slideUp('fast', function() {
        $('#editProfileImage').hide();
        fetchUserDetails(username);
    });
    initUpload();
}
var changeTweetButtonState = function() {
    document.getElementById("characterCount").innerHTML = (140-document.getElementById("tweetBox").value.length) + " characters left";
    if (document.getElementById("tweetBox").value.length > 0) {
        document.getElementById("tweetButton").removeAttribute('disabled');
        document.getElementById("tweetButton").setAttribute('class', 'btn btn-info');
    } else {
        document.getElementById("characterCount").innerHTML = '&nbsp;';
        document.getElementById("tweetButton").setAttribute('disabled');
        document.getElementById("tweetButton").setAttribute('class', 'btn disabled');
    }
}


var setProfileImage = function(image) {
    document.getElementById('profileImageDiv').innerHTML = '<img id="profileImage" src = "' + image + '?lastModified=' + new Date().getTime() + '">';
}

var clearSidebar = function() {
    $('#followers')[0].innerHTML = '<li class="divider"></li>';
    $('#following')[0].innerHTML = '<li class="divider"></li>';
}

var clearUserPosts = function() {
    $('#userPosts')[0].innerHTML = '';
}


var showUnFollowButton = function(alreadyFollowing) {
    console.log("Already Following : " + alreadyFollowing);
    if(alreadyFollowing) {
        $('#followButton')[0].setAttribute('class','btn btn-warning');
        $('#followButton')[0].innerHTML = "Unfollow";
        $('#followButton').click(function() {
            unfollow(parseInt(localStorage.userid), viewingUser.userid);
        });
    }
    else {
        $('#followButton')[0].setAttribute('class','btn btn-success');
        $('#followButton')[0].innerHTML = "Follow";
        $('#followButton').click(function() {
            follow(parseInt(localStorage.userid), viewingUser.userid);
        });                    
    }
    $('#followButton').show(); 
}
var removeAndAddFollowButton = function() {
    $('#followButtonDiv').empty();
    document.getElementById('followButtonDiv').innerHTML = '<button id="followButton" class="btn btn-warning" style="display:none;width:198px;">Unfollow</button>';
}

var initUpload = function() {
    document.getElementById('imageName').value = localStorage.username;
    document.getElementById('profileImageForm').onsubmit = function() {
    document.getElementById('profileImageForm').target = 'target_iframe';
    }
}

var uploadComplete = function(fileName) {
    viewingUser.image = fileName;
    localStorage.user = JSON.stringify(viewingUser);
    setProfileImage(fetchImage(viewingUser));
    changeProfileImage(fileName);
    reRenderFeed(fileName);
}
//init.js profile.js
var fetchTweets = function(userid, lastTweet) {
    if (lastTweet == undefined || lastTweet == 0) {
        lastTweet = 2147483647;
        viewingUser.posts = [];
    }
    $.ajax({
        url: serverAddress + "fetch/posts/" + userid + "?lastTweet=" + lastTweet + "&limit=20",
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        console.log(response.responseJSON);
        if(viewingUser.posts == undefined) viewingUser.posts = [];
        viewingUser.posts = viewingUser.posts.concat(response.responseJSON);
        renderUserPosts(response.responseJSON);
        $('#userPosts').show();
    });
}

var fetchFollowing = function(userid, offset, limit) {
    if (offset == undefined) offset = $('#following > li').children().length;
    if (limit == undefined) limit = 5;
    $.ajax({
        url: serverAddress + "users/follows/" + userid + "?offset=" + offset + "&limit=" + limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        renderFollowing(response.responseJSON);
    });
}

var fetchFollowers = function(userid, offset, limit) {
    if (offset == undefined) offset = $('#followers > li').children().length;
    if (limit == undefined) limit = 5;
    $.ajax({
        url: serverAddress + "users/followers/" + userid + "?offset=" + offset + "&limit=" + limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        renderFollowers(response.responseJSON);
    });
}

var fetchFeed = function(lastTweet) {
    if (alreadyFetchingFeed == true) return;
    $('#loading').show();
    alreadyFetchingFeed = true;
    if (lastTweet == undefined) {
        if (localStorage.feed != undefined) {
            if (document.getElementById('newsFeed').children.length == JSON.parse(localStorage.feed).length) {
                $('#loading').hide();
                return;
            }
            renderFeed(JSON.parse(localStorage.feed));
            $('#loading').hide();
            return;
        }
        localStorage.feed = "[]";
        lastTweet = 2147483647;
    }
    $.ajax({
        url: serverAddress + "fetch/feed?lastTweet=" + lastTweet + "&limit=30",
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        alreadyFetchingFeed = false;
        $('#loading').hide();
        localStorage.lastTweet = response.responseJSON[response.responseJSON.length - 1].tweetid;
        var existingFeed = JSON.parse(localStorage.feed);
        var newFeed = existingFeed.concat(response.responseJSON);
        localStorage.feed = JSON.stringify(newFeed);
        renderFeed(response.responseJSON)
    });
}


var fetchNewFeed = function() {
    if (localStorage.feed != undefined) {
        var finalTweet = JSON.parse(localStorage.feed)[0].tweetid;
        $.ajax({
            url: serverAddress + "fetch/feed/latest?tweetid=" + finalTweet,
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': localStorage.sessionid,
                'userid': localStorage.userid
            },
            error: function(jqXHR) {
                logout();
            }
        }).done(function(data, textStatus, response) {
            var existingFeed = JSON.parse(localStorage.feed);
            var newFeed = response.responseJSON.concat(existingFeed);
            localStorage.feed = JSON.stringify(newFeed);
            pushLatestFeed(response.responseJSON);
        });
    }
}

var fetchImage = function(tweet) {
    if (tweet.image == null) return "./img/profile/avatar.png";
    return "./img/profile/" + tweet.image;
}

var fetchUserDetails = function(username) {
    $.ajax({
        url: serverAddress + "users/" + username,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        $('#profileSideBar').slideDown('slow');
        clearSidebar();
        clearUserPosts();
        viewingUser = response.responseJSON;
        renderProfileSideBar(viewingUser);
        fetchFollowers(viewingUser.userid);
        fetchFollowing(viewingUser.userid);
        setInfiniteScroll("profile");
        fetchFollowingCount(viewingUser.userid)
        fetchFollowersCount(viewingUser.userid)
        fetchTweets(viewingUser.userid);
        if (viewingUser.userid == localStorage.userid)
            $('#followButton').hide();
        else
            follows(localStorage.userid, viewingUser.userid);
    });
}

var fetchFollowersCount = function(userid) {
    $.ajax({
        url: serverAddress + "users/followers/count/" + userid,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        renderFollowersCount(parseInt(response.responseText));
    });
}

var fetchFollowingCount = function(userid) {
    $.ajax({
        url: serverAddress + "users/follows/count/" + userid,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            logout();
        }
    }).done(function(data, textStatus, response) {
        renderFollowingCount(parseInt(response.responseText));
    });
}

var follows = function(follower, followed) {
    $.ajax({
        url: serverAddress + "users/check/follows/?follower=" + follower + "&followed=" + followed,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            logout();
        }
    }).done(function(data, textStatus, response) {
        if (response.responseText == "true")
            showUnFollowButton(true);
        else showUnFollowButton(false);
    });
}//init.js
var validateLogin = function(e) {
    if(validate('inputEmail') && validate('inputPassword')) {login(); return false;}
    else return false;
}

var checkKeyLogin = function(event) {
    if(event.keyCode == 13) {
        return validateLogin();
    }
    else return true;
}

var loggedIn = function() {
    if(localStorage.sessionid == undefined)
        return false;
    else return true;
}

var login = function() {
    $.ajax({
        url: serverAddress+"users/login",
        type: 'POST',
        contentType : "application/json",
        crossDomain : true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ email: document.getElementById('inputEmail').value, password: document.getElementById('inputPassword').value }),
        error: function(jqXHR){
            console.log(jqXHR);
            $('#loginDiv').popover('show');
            $('#inputEmail').focus();
            setTimeout(function() {$('#loginDiv').popover('hide');}, 3000);
        }
    }).done(function(data, textStatus, response) {
            viewingUser = response.responseJSON.user;
            localStorage.user = JSON.stringify(viewingUser);
            localStorage.sessionid = response.responseJSON.sessionid;
            localStorage.userid = response.responseJSON.user.userid;
            localStorage.username = response.responseJSON.user.username;
            localStorage.name = response.responseJSON.user.name;
            localStorage.tweetsFetched = 0;
            displayPage();
    });
    return false;
}

var logout = function() {
    console.log("Logout");
    $.ajax({
        url: serverAddress + "users/logout",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },        
        headers: {
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
        }
    }).done(function(data, textStatus, response) {
        localStorage.clear();
        document.location.href="./#";
        document.location.reload();
    });
}
var checkKeyRegister = function(event) {
    if(event.keyCode == 13) {
        return validateRegistrationForm();
    }
        else return true;
}

var validateRegistrationForm = function(e) {
    if(validate('inputNameRegistration') && validate('inputUsernameRegistration') && validate('inputEmailRegistration') && validate('inputPasswordRegistration')) {register(); return false;}
    else return false;
}

var register = function() {
    $.ajax({
        url: serverAddress+"users/register",
        contentType : "application/json",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            username: document.getElementById('inputUsernameRegistration').value, 
            email: document.getElementById('inputEmailRegistration').value, 
            password: document.getElementById('inputPasswordRegistration').value, 
            name: document.getElementById('inputNameRegistration').value 
        }),
        error: function(jqXHR){console.log(jqXHR.responseText);}
        }).done(function(data, textStatus, jqXHR) {
            document.getElementById('registrationForm').reset();
            bootbox.alert("Registeration complete. You can now sign in :)");
            document.getElementById('inputEmail').focus();
        });
}//init.js
var follow = function(followerid, followedid) {
    $.ajax({
        url: serverAddress + "users/follow",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            follower: followerid,
            followed: followedid
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            logout();
        }
    }).done(function(data, textStatus, response) {
        document.location.reload();
    });
    return false;
}

var unfollow = function(followerid, followedid) {
    $.ajax({
        url: serverAddress + "users/unfollow",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            follower: followerid,
            followed: followedid
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            logout();
        }
    }).done(function(data, textStatus, response) {
        document.location.reload();
    });
    return false;
}

var changeProfileImage = function(image) {
    $.ajax({
        url: serverAddress + "users/image/create",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            "image": image
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            //logout();
        }
    }).done(function(data, textStatus, response) {
        $('#profileImageForm').hide('slow', function() {
            //document.location.reload();
        });
    });
}

var postTweet = function() {
    $.ajax({
        url: serverAddress + "post/tweet",
        type: 'POST',
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({
            content: document.getElementById('tweetBox').value
        }),
        headers: {
            'Content-Type': 'application/json',
            'token': localStorage.sessionid,
            'userid': localStorage.userid
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            logout();
        }
    }).done(function(data, textStatus, response) {
        document.getElementById('tweetBox').value = "";
        changeTweetButtonState();
        var pushedTweet = response.responseJSON;
        pushNewTweet(pushedTweet, 'newsFeed');
    });
    return false;
}
//init.js
var renderFollowing = function(following) {
    var followingDiv = document.getElementById('following');
    for (var i = 0; i < following.length; i++) {
        pushFollowing(following[i]);
    }
}

var renderFollowers = function(followers) {
    var followersDiv = document.getElementById('followers');
    for (var i = 0; i < followers.length; i++) {
        pushFollowers(followers[i]);
    }
}

var renderProfileSideBar = function(user, timestamp) {
    if (user.userid == localStorage.userid) {
        $('#editProfileImage').show();
        initUpload();
    }
    document.getElementById('username').innerHTML = "<h4>" + user.name + "</h4>";
    setProfileImage(fetchImage(user));
}


var renderFeed = function(tweets) {
    for (var i = 0; i < tweets.length; i++) {
        pushTweet(tweets[i], 'newsFeed');
    }
}

var renderUserPosts = function(tweets) {
    if (tweets.length == 0 && viewingUser.posts.length == 0) document.getElementById('userPosts').innerHTML = '<h4><em>The newb is yet to tweet :/</em></h3>';
    for (var i = 0; i < tweets.length; i++) {
        pushTweet(tweets[i], 'userPosts');
    }
}

var renderResults = function(tweets) {
    document.getElementById('searchResultsHeader').innerHTML = '<h4><em>Showing results for "' + decodeURIComponent(query) + '" : </em></h4>';
    if (tweets.length == 0) document.getElementById('searchResults').innerHTML = '<h4><em>You can\'t haz resultz :3</em></h4>';
    for (var i = 0; i < tweets.length; i++) {
        pushTweet(tweets[i], 'searchResults');
    }
}

var reRenderFeed = function(newImage) {
    var tweets = JSON.parse(localStorage.feed);
    for(var i=0;i<tweets.length;i++)
        if(tweets[i].userid == localStorage.userid)
            tweets[i].image = newImage;
    localStorage.feed = JSON.stringify(tweets);
    document.getElementById('newsFeed').innerHTML = "";
    renderFeed(tweets);
}

var renderFollowersCount = function(count) {
    document.getElementById('followersButton').innerHTML = "Followers ("+count+")";
}

var renderFollowingCount = function(count) {
    document.getElementById('followingButton').innerHTML = "Following ("+count+")";
}

var pushFollowing = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followingDiv = document.getElementById('following');
    followingDiv.appendChild(element);
    followingDiv.appendChild(separator);
}

var pushFollowers = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followerDiv = document.getElementById('followers');
    followerDiv.appendChild(element);
    followerDiv.appendChild(separator);
}

var pushTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + fetchImage(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + imageParser(tweet.content) + '</div><div class="timestamp">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.appendChild(element);
}

var pushLatestFeed = function(tweets) {
    for (var i = 0; i < tweets.length; i++)
        pushNewTweet(tweets[i], 'newsFeed');
}

var pushNewTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + fetchImage(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + imageParser(tweet.content) + '</div><div class="timestamp">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</div></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.insertBefore(element, feedDiv.firstChild);
}

var imageParser = function(content) {
    var expression = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\.(jpeg|jpg|png|gif)/ig;
    return content.replace(expression, '<br><a href="$1.$3" target="_blank"><img src="$1.$3" style="width:100px;height:100px;"></a><br>')
}//init.js
var checkKeySearch = function(event) {
    $("#search").autocomplete("enable");
    if (event.keyCode == 13) {
        return doSearch();
    } else {
        if(document.getElementById('search').value[0]=='#')
            $("#search").autocomplete("disable");
        return true;
    }
}

var doSearch = function() {
    var query = document.getElementById('search').value;
    document.getElementById('search').value = '';
    document.getElementById('search').blur();
    if (query.length == 0) return false;
    if (query[0] == '#')
        document.location.href = document.location.href.split('#')[0] + '#search?q=' + encodeURIComponent(query.substring(1));
    else
        document.location.href = document.location.href.split('#')[0] + '#users/' + encodeURIComponent(query);
    return false;
}

var searchFunction = function(query, lastTweet) {
    if(lastTweet == undefined || lastTweet == 0) {
        lastTweet = 2147483647;
        search.result = [];
    }
    $.ajax({
        url: serverAddress + "search/tweets?keyword=" + query + "&lastTweet=" + lastTweet + "&limit=" + 10,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            console.log(jqXHR)
            logout();
        }
    }).done(function(data, textStatus, response) {
        if(search.results == undefined) search.result = [];
        search.result = search.result.concat(response.responseJSON);
        renderResults(response.responseJSON);
        $('#searchResults').slideDown();
    });
}
