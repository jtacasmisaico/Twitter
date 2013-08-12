var fetchTweets = function(userid, lastTweet) {
    if (lastTweet == undefined || lastTweet == 0) {
        lastTweet = 2147483647;
        viewingUser.posts = [];
    }
    $.ajax({
        url: serverAddress + "fetch/posts/" + userid + "?lastTweet=" + lastTweet + "&limit=10",
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
            if (document.getElementById('newsFeed').children.length == JSON.parse(localStorage.feed).length)
                return;
            renderFeed(JSON.parse(localStorage.feed));
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
}