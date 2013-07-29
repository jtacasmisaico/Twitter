<div id="loginDiv" style="display:none;" data-toggle="popover" data-placement="left" data-trigger="manual" data-content="Please check the username and password combination that you provided." data-original-title="Invalid Credentials">
  <form id="loginForm" class="form-horizontal" onsubmit="return login()" onkeypress="return checkKeyLogin(event)">
    <div class="control-group">
      <div class="controls">
        <input type="text" id="inputEmail" placeholder="Email" style="height:25px; width:240px;" requiredField>
      </div>
    </div>
    <div class="control-group">
      <div class="controls">
        <input class="span2" type="password" id="inputPassword" placeholder="Password" style="height:25px;" requiredField>
        <button type="submit" id="signInButton" class="btn btn-primary" onclick="return validateLogin()">Sign In</button>
      </div>
    </div>
  </form>
</div>

<script>

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
    // localStorage.clear();
    // document.location.href="./#";
    // document.location.reload();
}

var l = function() {
    console.log("Logout");
    localStorage.clear();
    document.location.href="./#";
    document.location.reload();
}
</script>