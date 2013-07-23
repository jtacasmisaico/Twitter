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