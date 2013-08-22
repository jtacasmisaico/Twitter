//boot.js

_$.display.page = function() {
    console.log("Displaying")
    if (_$.authentication.loggedIn()) {
        _$.display.loggedIn();
        _$.utils.detectURL();
    } else _$.display.loggedOut();
}

_$.display.profile = function(username) {
    document.getElementById('navHomeButton').setAttribute('class', '');
    if(username != localStorage.username) document.getElementById('navProfileButton').setAttribute('class', '');
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
    _$.fetch.trending();
}

_$.display.search = function() {
    $('#userPosts').hide();
    $('#newsFeed').hide();
    document.getElementById('searchResults').innerHTML = '<div id="searchResultsHeader"></div>';
    _$.utils.setInfiniteScroll("search");
    _$.global.query = decodeURI(window.location.hash.split('#')[1].split(/\?|\//)[1].substring(2));
    _$.utils.searchFunction(_$.global.query);
}

_$.display.hashTag = function() {    
    _$.fetch.trending();
    if(_$.global.viewingUser!=undefined && _$.global.viewingUser.userid != localStorage.userid) {
        _$.render.clearSidebar();
        _$.global.viewingUser = JSON.parse(localStorage.user);
        $('#profileSideBar').slideUp('fast', function() {
            _$.fetch.following(localStorage.userid);
            _$.fetch.followers(localStorage.userid);
            _$.render.profileSideBar(_$.global.viewingUser,false);
            $('#userPosts').slideUp('fast');
            $('#profileSideBar').show();
            $('#followButton').hide();
            _$.fetch.followingCount(parseInt(localStorage.userid));
            _$.fetch.followersCount(parseInt(localStorage.userid));
        });
    }
    else _$.render.profileSideBar(JSON.parse(localStorage.user), false);
    document.getElementById('searchResults').innerHTML = '<div id="searchResultsHeader"></div>';
    $('#tweetForm').hide();
    $('#newsFeed').hide();
    $('#userPosts').hide();    
    $('#profileSideBar').show();
    _$.utils.setInfiniteScroll("search");
    _$.fetch.hashTag(_$.global.hashTag);
}

_$.display.loggedIn = function() {
    $('#loggedIn').show();
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
    if(_$.authentication.loggedIn()) _$.display.loggedIn();
    $('#searchResults').hide();
    $('#userPosts').slideUp('fast');
    $('#profileSideBar').slideDown('slow');
    $('#tweetForm').slideDown('slow');
    $('#newsFeed').show();
    $('#tweetForm').show();
    $('#followButton').hide();
    _$.fetch.followingCount(parseInt(localStorage.userid));
    _$.fetch.followersCount(parseInt(localStorage.userid));
    _$.fetch.trending();
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
    $('#tweetForm').hide();
    $('#loggedIn').hide();
}