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
    _$.global.alreadyFetchingFeed = true;
    if (lastTweet == undefined) {
        if (localStorage.feed != undefined) {
            if (document.getElementById('newsFeed').children.length == JSON.parse(localStorage.feed).length) {
                return;
            }
            _$.render.feed(JSON.parse(localStorage.feed));
            return;
        }
        localStorage.feed = "[]";
        lastTweet = 2147483647;
    }
    $.ajax({
        url: _$.global.serverAddress + "fetch/feed?lastTweet=" + lastTweet + "&limit=20",        type: 'GET',
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
            _$.global.alreadyFetchingFeed = false;
            _$.authentication.logout();
        }
    }).done(function(data, textStatus, response) {
        _$.global.alreadyFetchingFeed = false;
        localStorage.lastTweet = response.responseJSON[response.responseJSON.length - 1].tweetid;
        var existingFeed = JSON.parse(localStorage.feed);
        var newFeed = existingFeed.concat(response.responseJSON);
        localStorage.feed = JSON.stringify(newFeed);
        _$.render.feed(response.responseJSON)
    });
}

_$.fetch.newFeed = function() {
    if (localStorage.feed != undefined) {
        if(localStorage.feed == []) {_$.fetch.feed(); return;}
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
    if (tweet.image == null) return _$.global.appAddress+"img/profile/avatar.png";
    return _$.global.appAddress+"img/profile/" + tweet.image;
}

_$.fetch.userDetails = function(username) {
    $.ajax({
        url: _$.global.serverAddress + "users/username/" + username,
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
        _$.global.viewingUser.followerCount = parseInt(response.responseText);
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
        _$.global.viewingUser.followingCount = parseInt(response.responseText);
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
    });
}

_$.fetch.trending = function() {
    if(_$.global.trending == undefined)
        $.ajax({
            url: _$.global.serverAddress + "fetch/trending",
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            error: function(jqXHR) {
                console.log(jqXHR);
                _$.authentication.logout();
            }
        }).done(function(data, textStatus, response) {
            _$.global.trending = response.responseJSON;
            _$.render.trending(response.responseJSON);
        });
}
