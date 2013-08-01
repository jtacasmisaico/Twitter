
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
