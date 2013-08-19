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
//boot.js

_$.display.page = function() {
    console.log("Displaying")
    if (_$.authentication.loggedIn()) {
        _$.display.loggedIn();
        _$.utils.detectURL();
    } else _$.display.loggedOut();
}

_$.display.profile = function(username) {
    _$.render.removeAndAddFollowButton();
    $('#searchResults').hide();
    $('#newsFeed').hide();
    $('#tweetForm').slideUp('slow');
    $('#newsFeed').slideUp('slow');
    $('#userPosts').slideDown('slow');
    $('#profileSideBar').slideUp('fast', function() {
        $('#editProfileImage').hide();
        _$.fetch.userDetails(username);
    });
    _$.utils.initUpload();
}

_$.display.search = function() {
    $('#userPosts').hide();
    $('#newsFeed').hide();
    _$.utils.setInfiniteScroll("search");
    _$.global.query = decodeURI(window.location.hash.split('#')[1].split(/\?|\//)[1].substring(2));
    _$.utils.searchFunction(_$.global.query);
}

_$.display.hashTag = function() {
    $('#userPosts').hide();
    $('#newsFeed').hide();
    _$.utils.setInfiniteScroll("search");
    _$.fetch.hashTag(_$.global.hashTag);
}

_$.display.loggedIn = function() {
    $('#navBarLoggedOut').hide();
    $('#navBarLoggedIn').show();
    $('#loginDiv').hide();
    $('#splash').hide();
    $('#registerationDiv').hide();
}

_$.display.homePage = function() {
    _$.render.clearSidebar();
    _$.global.viewingUser = JSON.parse(localStorage.user);
    $('#profileSideBar').slideUp('fast', function() {
        _$.fetch.following(localStorage.userid);
        _$.fetch.followers(localStorage.userid);
        _$.fetch.feed();
        _$.render.profileSideBar(_$.global.viewingUser);
    });
    $('#searchResults').hide();
    $('#userPosts').slideUp('fast');
    $('#profileSideBar').slideDown('slow');
    $('#tweetForm').slideDown('slow');
    $('#newsFeed').show();
    $('#tweetForm').show();
    $('#followButton').hide();
    _$.fetch.followingCount(parseInt(localStorage.userid))
    _$.fetch.followersCount(parseInt(localStorage.userid))
    _$.utils.setInfiniteScroll("feed");
}

_$.display.loggedOut = function() {
    $('#searchResults').hide();
    $('#newsFeed').hide();
    $('#navBarLoggedIn').hide();
    $('#navBarLoggedOut').show();
    $('#registerationDiv').show();
    $('#loginDiv').show();
    $('#splash').show();
    $('#profileSideBar').hide();
}//boot.js
_$.utils.changeTweetButtonState = function() {
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


 _$.utils.setProfileImage = function(image) {
    document.getElementById('profileImageDiv').innerHTML = '<img id="profileImage" src = "' + image + '?lastModified=' + new Date().getTime() + '">';
}

_$.render.clearSidebar = function() {
    $('#followers')[0].innerHTML = '<li class="divider"></li>';
    $('#following')[0].innerHTML = '<li class="divider"></li>';
}

_$.render.clearUserPosts = function() {
    $('#userPosts')[0].innerHTML = '';
}

_$.render.showUnFollowButton = function(alreadyFollowing) {
    if(alreadyFollowing) {
        $('#followButton')[0].setAttribute('class','btn btn-warning');
        $('#followButton')[0].innerHTML = "Unfollow";
        $('#followButton').click(function() {
            _$.post.unfollow(parseInt(localStorage.userid), _$.global.viewingUser.userid);
        });
    }
    else {
        $('#followButton')[0].setAttribute('class','btn btn-success');
        $('#followButton')[0].innerHTML = "Follow";
        $('#followButton').click(function() {
            _$.post.follow(parseInt(localStorage.userid), _$.global.viewingUser.userid);
        });                    
    }
    $('#followButton').show(); 
}
_$.render.removeAndAddFollowButton = function() {
    $('#followButtonDiv').empty();
    document.getElementById('followButtonDiv').innerHTML = '<button id="followButton" class="btn btn-warning" style="display:none;width:198px;">Unfollow</button>';
}

_$.utils.initUpload = function() {
    document.getElementById('imageName').value = localStorage.username;
    document.getElementById('profileImageForm').onsubmit = function() {
    document.getElementById('profileImageForm').target = 'target_iframe';
    }
}

_$.utils.uploadComplete = function(fileName) {
    _$.global.viewingUser.image = fileName;
    localStorage.user = JSON.stringify(_$.global.viewingUser);
    _$.utils.setProfileImage(_$.fetch.image(_$.global.viewingUser));
    _$.post.changeProfileImage(fileName);
    _$.render.againFeed(fileName);
}
//boot.js profile.js
_$.fetch.tweets = function(userid, lastTweet) {
    if (lastTweet == undefined || lastTweet == 0) {
        lastTweet = 2147483647;
        _$.global.viewingUser.posts = [];
    }
    $.ajax({
        url: _$.global.serverAddress + "fetch/posts/" + userid + "?lastTweet=" + lastTweet + "&limit=20",
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        console.log(response.responseJSON);
        if(_$.global.viewingUser.posts == undefined) _$.global.viewingUser.posts = [];
        _$.global.viewingUser.posts = _$.global.viewingUser.posts.concat(response.responseJSON);
        _$.render.userPosts(response.responseJSON);
        $('#userPosts').show();
    });
}

_$.fetch.following = function(userid, offset, limit) {
    if (offset == undefined) offset = $('#following > li').children().length;
    if (limit == undefined) limit = 5;
    $.ajax({
        url: _$.global.serverAddress + "users/follows/" + userid + "?offset=" + offset + "&limit=" + limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.render.following(response.responseJSON);
    });
}

_$.fetch.followers = function(userid, offset, limit) {
    if (offset == undefined) offset = $('#followers > li').children().length;
    if (limit == undefined) limit = 5;
    $.ajax({
        url: _$.global.serverAddress + "users/followers/" + userid + "?offset=" + offset + "&limit=" + limit,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.render.followers(response.responseJSON);
    });
}

_$.fetch.feed = function(lastTweet) {
    if (_$.global.alreadyFetchingFeed == true) return;
    $('#loading').show();
    _$.global.alreadyFetchingFeed = true;
    if (lastTweet == undefined) {
        if (localStorage.feed != undefined) {
            if (document.getElementById('newsFeed').children.length == JSON.parse(localStorage.feed).length) {
                $('#loading').hide();
                return;
            }
            _$.render.feed(JSON.parse(localStorage.feed));
            $('#loading').hide();
            return;
        }
        localStorage.feed = "[]";
        lastTweet = 2147483647;
    }
    $.ajax({
        url: _$.global.serverAddress + "fetch/feed?lastTweet=" + lastTweet + "&limit=30",
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
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.global.alreadyFetchingFeed = false;
        $('#loading').hide();
        localStorage.lastTweet = response.responseJSON[response.responseJSON.length - 1].tweetid;
        var existingFeed = JSON.parse(localStorage.feed);
        var newFeed = existingFeed.concat(response.responseJSON);
        localStorage.feed = JSON.stringify(newFeed);
        _$.render.feed(response.responseJSON)
    });
}

_$.fetch.newFeed = function() {
    if (localStorage.feed != undefined) {
        var finalTweet = JSON.parse(localStorage.feed)[0].tweetid;
        $.ajax({
            url: _$.global.serverAddress + "fetch/feed/latest?tweetid=" + finalTweet,
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
                _$.authentication.logout();
            }
        }).done(function(data, textStatus, response) {
            var existingFeed = JSON.parse(localStorage.feed);
            var newFeed = response.responseJSON.concat(existingFeed);
            localStorage.feed = JSON.stringify(newFeed);
            _$.render.push.latestFeed(response.responseJSON);
        });
    }
}

_$.fetch.image = function(tweet) {
    if (tweet.image == null) return "./img/profile/avatar.png";
    return "./img/profile/" + tweet.image;
}

_$.fetch.userDetails = function(username) {
    $.ajax({
        url: _$.global.serverAddress + "users/" + username,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        $('#profileSideBar').slideDown('slow');
        _$.render.clearSidebar();
        _$.render.clearUserPosts();
        _$.global.viewingUser = response.responseJSON;
        _$.render.profileSideBar(_$.global.viewingUser);
        _$.fetch.followers(_$.global.viewingUser.userid);
        _$.fetch.following(_$.global.viewingUser.userid);
        _$.utils.setInfiniteScroll("profile");
        _$.fetch.followingCount(_$.global.viewingUser.userid)
        _$.fetch.followersCount(_$.global.viewingUser.userid)
        _$.fetch.tweets(_$.global.viewingUser.userid);
        if (_$.global.viewingUser.userid == localStorage.userid)
            $('#followButton').hide();
        else
            _$.fetch.follows(localStorage.userid, _$.global.viewingUser.userid);
    });
}

_$.fetch.followersCount = function(userid) {
    $.ajax({
        url: _$.global.serverAddress + "users/followers/count/" + userid,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.render.followersCount(parseInt(response.responseText));
    });
}

_$.fetch.followingCount = function(userid) {
    $.ajax({    
        url: _$.global.serverAddress + "users/follows/count/" + userid,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.render.followingCount(parseInt(response.responseText));
    });
}

_$.fetch.follows = function(follower, followed) {
    $.ajax({
        url: _$.global.serverAddress + "users/check/follows/?follower=" + follower + "&followed=" + followed,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        if (response.responseText == "true")
            _$.render.showUnFollowButton(true);
        else _$.render.showUnFollowButton(false);
    });
}

_$.fetch.hashTag = function(tag) {
    $.ajax({
        url: _$.global.serverAddress + "hashtag/"+_$.global.hashtag,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            console.log(jqXHR);
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.render.results(response.responseJSON, "hashtag");
        $('#searchResults').slideDown();
    });
}
//init.js
_$.utils.validateLogin = function(e) {
    if(validate('inputEmail') && validate('inputPassword')) {_$.authentication.login(); return false;}
    else return false;
}

_$.utils.checkKeyLogin = function(event) {
    if(event.keyCode == 13) {
        return _$.utils.validate_$.authentication.login();
    }
    else return true;
}

_$.authentication.loggedIn = function() {
    if(localStorage.sessionid == undefined)
        return false;
    else return true;
}

_$.authentication.login = function() {
    $.ajax({
        url: _$.global.serverAddress+"users/login",
        type: 'POST',
        contentType : "application/json",
        crossDomain : true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ email: document.getElementById('inputEmail').value, password: document.getElementById('inputPassword').value }),
        error: function(jqXHR){
            console.log(jqXHR);
            $('#_$.authentication.loginDiv').popover('show');
            $('#inputEmail').focus();
            setTimeout(function() {$('#_$.authentication.loginDiv').popover('hide');}, 3000);
        }
    }).done(function(data, textStatus, response) {
            _$.global.viewingUser = response.responseJSON.user;
            localStorage.user = JSON.stringify(_$.global.viewingUser);
            localStorage.sessionid = response.responseJSON.sessionid;
            localStorage.userid = response.responseJSON.user.userid;
            localStorage.username = response.responseJSON.user.username;
            localStorage.name = response.responseJSON.user.name;
            localStorage.tweetsFetched = 0;
            _$.display.page();
    });
    return false;
}

_$.authentication.logout = function() {
    console.log("_$.authentication.logout");
        $.ajax({
        url: _$.global.serverAddress + "users/logout",
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
_$.utils.checkKeyRegister = function(event) {
    if(event.keyCode == 13) {
        return _$.utils.validateRegistrationForm();
    }
        else return true;
}

_$.utils.validateRegistrationForm = function(e) {
    if(validate('inputNameRegistration') && validate('inputUsernameRegistration') && validate('inputEmailRegistration') && validate('inputPasswordRegistration')) {_$.authentication.register(); return false;}
    else return false;
}

_$.authentication.register = function() {
    $.ajax({
        url: _$.global.serverAddress+"users/_$.authentication.register",
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
            bootbox.alert("_$.authentication.registeration complete. You can now sign in :)");
            document.getElementById('inputEmail').focus();
        });
}//boot.js
_$.post.follow = function(followerid, followedid) {
    $.ajax({
        url: _$.global.serverAddress + "users/follow",
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
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        document.location.reload();
    });
    return false;
}

_$.post.unfollow = function(followerid, followedid) {
    $.ajax({
        url: _$.global.serverAddress + "users/unfollow",
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
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        document.location.reload();
    });
    return false;
}

_$.post.changeProfileImage = function(image) {
    $.ajax({
        url: _$.global.serverAddress + "users/image/create",
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
            //_$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        $('#profileImageForm').hide('slow', function() {
            //document.location.reload();
        });
    });
}

_$.post.tweet = function() {
    $.ajax({
        url: _$.global.serverAddress + "post/tweet",
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
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        document.getElementById('tweetBox').value = "";
        _$.utils.changeTweetButtonState();
        var pushedTweet = response.responseJSON;
        var existingFeed = JSON.parse(localStorage.feed);
        existingFeed.unshift(response.responseJSON);
        localStorage.feed = JSON.stringify(existingFeed);
        _$.render.push.newTweet(pushedTweet, 'newsFeed');
    });
    return false;
}
//boot.js
_$.render.following = function(following) {
    var followingDiv = document.getElementById('following');
    for (var i = 0; i < following.length; i++) {
        _$.render.push.following(following[i]);
    }
}

_$.render.followers = function(followers) {
    var followersDiv = document.getElementById('followers');
    for (var i = 0; i < followers.length; i++) {
        _$.render.push.followers(followers[i]);
    }
}

_$.render.profileSideBar = function(user, timestamp) {
    if (user.userid == localStorage.userid) {
        $('#editProfileImage').show();
        _$.utils.initUpload();
    }
    document.getElementById('username').innerHTML = "<h4>" + user.name + "</h4>";
    _$.utils.setProfileImage(_$.fetch.image(user));
}


_$.render.feed = function(tweets) {
    for (var i = 0; i < tweets.length; i++) {
        _$.render.push.tweet(tweets[i], 'newsFeed');
    }
}

_$.render.userPosts = function(tweets) {
    if (tweets.length == 0 && _$.global.viewingUser.posts.length == 0) document.getElementById('userPosts').innerHTML = '<h4><em>The newb is yet to tweet :/</em></h3>';
    for (var i = 0; i < tweets.length; i++) {
        _$.render.push.tweet(tweets[i], 'userPosts');
    }
}

_$.render.results = function(tweets, hashtag) {
    if(hashtag == undefined)
        document.getElementById('searchResultsHeader').innerHTML = '<h4><em>Showing results for "' + decodeURIComponent(_$.global.query) + '" : </em></h4>';
    else
        document.getElementById('searchResultsHeader').innerHTML = '<h4><em>Showing tweets for "#' + _$.global.hashtag + '" : </em></h4>'; 
    if (tweets.length == 0) document.getElementById('searchResults').innerHTML = '<h4><em>You can\'t haz resultz :3</em></h4><div id="searchResultsHeader"></div>';
    for (var i = 0; i < tweets.length; i++) {
        _$.render.push.tweet(tweets[i], 'searchResults');
    }
}

_$.render.againFeed = function(newImage) {
    var tweets = JSON.parse(localStorage.feed);
    for(var i=0;i<tweets.length;i++)
        if(tweets[i].userid == localStorage.userid)
            tweets[i].image = newImage;
    localStorage.feed = JSON.stringify(tweets);
    document.getElementById('newsFeed').innerHTML = "";
    _$.render.feed(tweets);
}

_$.render.followersCount = function(count) {
    document.getElementById('followersButton').innerHTML = "Followers ("+count+")";
}

_$.render.followingCount = function(count) {
    document.getElementById('followingButton').innerHTML = "Following ("+count+")";
}

_$.render.push.following = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followingDiv = document.getElementById('following');
    followingDiv.appendChild(element);
    followingDiv.appendChild(separator);
}

_$.render.push.followers = function(user) {
    var element = document.createElement('li');
    element.innerHTML = '<a href="#users/' + user.username + '">' + user.username + '</a>';
    var separator = document.createElement('li');
    separator.setAttribute('class', 'divider');
    var followerDiv = document.getElementById('followers');
    followerDiv.appendChild(element);
    followerDiv.appendChild(separator);
}

_$.render.push.tweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + _$.fetch.image(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + _$.utils.hashTagsParser(_$.utils.youTubeParser(_$.utils.imageParser(tweet.content))) + '</div><abbr class="timestamp" title="'+new Date(tweet.timestamp).toISOString()+'">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</abbr></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.appendChild(element);
    jQuery("abbr.timestamp").timeago();
}

_$.render.push.latestFeed = function(tweets) {
    for (var i = 0; i < tweets.length; i++)
        _$.render.push.newTweet(tweets[i], 'newsFeed');
}

_$.render.push.newTweet = function(tweet, divId) {
    var element = document.createElement('div');
    element.setAttribute('class', 'media');
    element.innerHTML = '<a class="pull-left" href="#users/' + tweet.username + '"><img class="media-object pthumbnail" src="' + _$.fetch.image(tweet) + '"></a><div class="media-body tweet"><h4 class="media-heading"><a href="#users/' + tweet.username + '">' + tweet.username + '</a></h4>' + _$.utils.hashTagsParser(_$.utils.youTubeParser(_$.utils.imageParser(tweet.content))) + '</div><abbr class="timestamp" title="'+new Date(tweet.timestamp).toISOString()+'">' + new Date(tweet.timestamp).toString().substring(0, 21) + '</abbr></div>'
    var feedDiv = document.getElementById(divId);
    feedDiv.insertBefore(element, feedDiv.firstChild);
    jQuery("abbr.timestamp").timeago();
}

_$.utils.imageParser = function(content) {
    var expression = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])\.(jpeg|jpg|png|gif)/ig;
    return content.replace(expression, '<br><a href="$1.$3" target="_blank"><img src="$1.$3" style="width:100px;height:100px;"></a><br>')
}

_$.utils.youTubeParser = function(content) {
    return content.replace(/(?:http:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g, '<iframe width="210" height="160" src="http://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe>');
}

_$.utils.hashTagsParser = function(content) {
    return content.replace(/#(\w+)/g, '<a href="./#hashtag/$1">#$1</a>');
}//boot.js
_$.utils.checkKeySearch = function(event) {
    $("#search").autocomplete("enable");
    if (event.keyCode == 13) {
        return _$.utils.doSearch();
    } else {
        if(document.getElementById('search').value[0]=='#')
            $("#search").autocomplete("disable");
        return true;
    }
}

_$.utils.doSearch = function() {
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

_$.utils.searchFunction = function(query, lastTweet) {
    if(lastTweet == undefined || lastTweet == 0) {
        lastTweet = 2147483647;
        search.result = [];
    }
    $.ajax({
        url: _$.global.serverAddress + "search/tweets?keyword=" + query + "&lastTweet=" + lastTweet + "&limit=" + 10,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR) {
            console.log(jqXHR)
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        if(search.results == undefined) search.result = [];
        search.result = search.result.concat(response.responseJSON);
        _$.render.results(response.responseJSON);
        $('#searchResults').slideDown();
    });
}
