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

/*
var displayLoggedIn = function() {
    fetchTweets(localStorage.userid);
    fetchFollows();
    fetchFollowers();
    fetchFeed();       
    renderProfileSideBar(); 
    $('#navBarLoggedOut').hide();
    $('#registerationDiv').hide();
    $('#loginDiv').hide();
    $('#splash').hide();
    $('#navBarLoggedIn').show();
    $('#newsFeed').show();
    $('#tweetForm').show();
    $('#profileSideBar').show();
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
*/
var displayLoggedIn = function() {
    var functionList = [
        function(cb) {fetchTweets(localStorage.userid); cb(null); },
        function(cb) {$('#navBarLoggedOut').hide(); cb(null);},
        function(cb) {$('#registerationDiv').hide(); cb(null); },
        function(cb) {$('#loginDiv').hide(); cb(null); },
        function(cb) {$('#splash').hide(); cb(null); },
        function(cb) {$('#navBarLoggedIn').show(); cb(null); },
        function(cb) {$('#newsFeed').show(); cb(null); },
        function(cb) {$('#tweetForm').show(); cb(null); },
        function(cb) {$('#profileSideBar').show(); cb(null); },
        function(cb) {fetchFollows(); cb(null); },
        function(cb) {fetchFollowers(); cb(null); },
        function(cb) {fetchFeed(); cb(null); }
    ];
    async.series(functionList, null);
}

var displayLoggedOut = function() {
    var functionList = [
        function(cb) {$('#newsFeed').hide(); cb(null); },
        function(cb) {$('#navBarLoggedIn').hide(); cb(null); },
        function(cb) {$('#navBarLoggedOut').show();     cb(null); },
        function(cb) {$('#registerationDiv').show(); cb(null); },
        function(cb) {$('#loginDiv').show(); cb(null); },
        function(cb) {$('#splash').show(); cb(null); },
        function(cb) {$('#profileSideBar').hide(); cb(null); }
    ];
    async.series(functionList, null);
}

