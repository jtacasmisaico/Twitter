
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
        url: serverAddress+"users/login",
        type: 'POST',
        contentType : "application/json",
        crossDomain : true,
        xhrFields: {
            withCredentials: true
        },
        data: JSON.stringify({ email: document.getElementById('inputEmail').value, password: document.getElementById('inputPassword').value }),
        error: function(jqXHR){
            console.log(jqXHR);
            $('#loginDiv').popover('show');
            $('#inputEmail').focus();
            setTimeout(function() {$('#loginDiv').popover('hide');}, 3000);
        }
    }).done(function(data, textStatus, response) {
            viewingUser = response.responseJSON.user;
            localStorage.user = JSON.stringify(viewingUser);
            localStorage.sessionid = response.responseJSON.sessionid;
            localStorage.userid = response.responseJSON.user.userid;
            localStorage.username = response.responseJSON.user.username;
            localStorage.name = response.responseJSON.user.name;
            localStorage.tweetsFetched = 0;
            displayPage();
    });
    return false;
}

var logout = function() {
    console.log("Logout");
    $.ajax({
        url: serverAddress + "users/logout",
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
    $.ajax({
        url: serverAddress+"users/register",
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
            bootbox.alert("Registeration complete. You can now sign in :)");
            document.getElementById('inputEmail').focus();
        });
}