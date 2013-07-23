window.onload = function() {
    displayPage();
    //var intervalID = setInterval(function(){displayPage();}, 1000);
};

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
    fetchFollows();
    fetchFeed();
}

var displayLoggedOut = function() {
    $('#newsFeed').hide();
    $('#navBarLoggedIn').hide();
    $('#navBarLoggedOut').show();    
    $('#registerationDiv').show();
    $('#loginDiv').show();
    $('#splash').show();
}

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
        url: "http://localhost:8080/login",
        type: 'POST',
        contentType : "application/json",
        data: JSON.stringify({ email: document.getElementById('inputEmail').value, password: document.getElementById('inputPassword').value }),
        error: function(jqXHR){
            $('#loginDiv').popover('show');
            $('#inputEmail').focus();
            setTimeout(function() {$('#loginDiv').popover('hide');}, 3000);
        }
        }).done(function(data, textStatus, response) {
            console.log("Logged in");
            localStorage.sessionid = response.responseJSON.sessionid;
            localStorage.userid = response.responseJSON.user.userid;
            console.log(localStorage.sessionid);
            displayLoggedIn();
        });
    return false;
}

var fetchFollows = function() {
    console.log("Fetching followers");
   $.ajax({
        url: "http://localhost:8080/users/"+localStorage.userid+"/follows",
        type: 'GET',
        error: function(jqXHR){
            logout();
        }
        }).done(function(data, textStatus, response) {
            localStorage.follows = JSON.stringify(response.responseJSON);
            renderFollows(response.responseJSON);
        });
}

var renderFollows = function(follows) {
    console.log("Followers set");
}

var fetchFeed = function() {
    $.ajax({
        url: "http://localhost:8080/feed",
        type: 'POST',
        data: JSON.stringify({ userid: localStorage.userid }),
headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token':localStorage.sessionid
        },
        error: function(jqXHR){
            logout();
        }
        }).done(function(data, textStatus, response) {
            localStorage.feed = JSON.stringify(response.responseJSON);
            console.log(response.responseText);
            renderFeed(response.responseJSON)
        });
}

var findUsername = function(userid) {
    var list = JSON.parse(localStorage.follows);
    for(var i=0;i<list.length;i++) {
        if(list[i].userid==userid)
            return list[i].username;
    }
}

var renderFeed = function(tweets) {
    var feedDiv = document.getElementById('newsFeed');
    for(var i=0;i<tweets.length;i++) {
        var tweet = document.createElement('div');
        tweet.setAttribute('class', 'media');
        console.log(findUsername(tweets[i].userid));
        tweet.innerHTML = '<a class="pull-left" href="#users/'+findUsername(tweets[i].userid)+'"><img class="media-object" src="./img/avatar.png"></a><div class="media-body"><h4 class="media-heading">'+findUsername(tweets[i].userid)+'</h4>'+tweets[i].content+'</div></div>'
        feedDiv.appendChild(tweet);
    }
}

var logout = function() {
    delete localStorage.sessionid;
    delete localStorage.user;
    delete localStorage.follows;
    document.location.reload();
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
    alert("Register");
    $.ajax({
        url: "http://localhost:8080/register",
        contentType : "application/json",
        type: 'POST',
        data: JSON.stringify({
            username: document.getElementById('inputUsernameRegistration').value, 
            email: document.getElementById('inputEmailRegistration').value, 
            password: document.getElementById('inputPasswordRegistration').value, 
            name: document.getElementById('inputNameRegistration').value 
        }),
        beforeSend: function() {console.log("Before send");},
        error: function(jqXHR){console.log("Errorwa :("); console.log(jqXHR.responseText);},
        dataFilter: function(){console.log("DataFilter")},
        success: function(success){console.log(success)}
    }).done(function(data, textStatus, jqXHR) {
        alert(jqXHR.responseText);
    });
}