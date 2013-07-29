var serverAddress;
var viewingUser;
window.onload = function() {
    init();
    displayPage();
    //var intervalID = setInterval(function(){displayPage();}, 1000);
};
var init = function() {
    serverAddress = "http://localhost:8080/";
}

var scrollalert = function(){  
    var scrolltop=$('#followingDiv').attr('scrollTop');  
    var scrollheight=$('#followingDiv').attr('scrollHeight');  
    var windowheight=$('#followingDiv').attr('clientHeight');  
    var scrolloffset=20;  
    console.log(scrolltop, scrollheight, windowheight);
    if(scrolltop>=(scrollheight-(windowheight+scrolloffset)))  
    {  
        alert("Bottom");
    }  
    //setTimeout('scrollalert();', 1500);  
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
    path = path.split('/')
    if(path[0] == "users") displayProfile(path[1]);
    else displayHomePage();
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
        renderProfileSideBar(localStorage.name);
    });    
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
    $('#newsFeed').hide(); 
    $('#navBarLoggedIn').hide();
    $('#navBarLoggedOut').show();    
    $('#registerationDiv').show();
    $('#loginDiv').show();
    $('#splash').show();
    $('#profileSideBar').hide();
}


var follows = function(userid, followers) {
    for(var i=0; i<followers.length; i++) 
        if(followers[i].userid == userid)
            return true;
    return false;
}