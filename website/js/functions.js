var serverAddress;
var viewingUser;
var query;
window.onload = function() {
    init();
    displayPage();
    var intervalID = setInterval(function(){fetchNewFeed();}, 3000);
};
var init = function() {
    serverAddress = "http://localhost:8080/";
}

window.onhashchange = function() { detectURL(); }

var displayPage = function () {  
    if(loggedIn()) {
        displayLoggedIn();
        detectURL();
    }
    else displayLoggedOut();
}

var detectURL = function() {
    var path = window.location.hash.split('#')[1];
    if(path == undefined) {
        displayHomePage();
        return;
    }
    path = path.split(/\?|\//);
    if(path[0] == "users") displayProfile(path[1]);
    else if(path[0] == "search") { displayHomePage(); displaySearch(); }
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


var follows = function(follower, followed) {
    $.ajax({
        url: serverAddress+"users/check/follows/?follower="+follower+"&followed="+followed,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR){
            console.log(jqXHR);
            logout();
        }
    }).done(function(data, textStatus, response) {
        if(response.responseText == "true")
            showUnFollowButton(true);
        else showUnFollowButton(false);
    });

}

var doSearch = function() {    
    var query = document.getElementById('search').value;
    if(query.length==0) return false;
    document.location.href = document.location.href.split('#')[0]+'#search?q='+encodeURIComponent(query);
    return false;
}

var searchFunction = function(query) {
    $.ajax({
        url: serverAddress+"search/tweet?keyword="+query+"&offset="+0+"&limit="+10,
        type: 'GET',
        xhrFields: {
            withCredentials: true
        },
        error: function(jqXHR){
            console.log(jqXHR)
            logout();
        }
    }).done(function(data, textStatus, response) {
            renderResults(response.responseJSON);
            $('#searchResults').slideDown();
    });
}