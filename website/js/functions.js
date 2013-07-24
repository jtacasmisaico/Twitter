window.onload = function() {
    init();
    displayPage();
    //var intervalID = setInterval(function(){displayPage();}, 1000);
};

var init = function() {
}

var displayPage = function () {  
    if(loggedIn())
        displayLoggedIn();
    else displayLoggedOut();
}


var displayLoggedIn = function() {
    $('#navBarLoggedOut').hide();
    $('#registerationDiv').hide();
    $('#loginDiv').hide();
    $('#splash').hide();
    $('#navBarLoggedIn').show();
    $('#newsFeed').show();
    $('#tweetForm').show();
    $('#profileSideBar').show();
    fetchTweets(localStorage.userid);
    fetchFollows();
    fetchFollowers();
    fetchFeed();    
    renderProfileSideBar();
}

var displayLoggedOut = function() {
    $('#newsFeed').hide();
    $('#navBarLoggedIn').hide();
    $('#navBarLoggedOut').show();    
    $('#registerationDiv').show();
    $('#loginDiv').show();
    $('#splash').show();
    $('#profileSideBar').hide();
}

