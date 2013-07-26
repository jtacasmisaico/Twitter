<div id="registerationDiv" style="display:none;">
<h4 style="text-align:center">New to Twitter? Sign up!</h4>
<form id="registrationForm" class="form-horizontal" onsubmit="return validateRegistrationForm()" onkeypress="return checkKeyRegister(event)">
  <div class="control-group">
    <div class="controls">
      <input type="text" id="inputNameRegistration" placeholder="Full Name" style="height:25px;width:240px;" requiredField>
    </div>
  </div>
  <div class="control-group">
    <div class="controls">
      <input type="text" id="inputUsernameRegistration" form-validation="length" min-length-value="3" placeholder="Username" style="height:25px;width:240px;">
    </div>
  </div>
  <div class="control-group">
    <div class="controls">
      <input type="text" form-validation="email" id="inputEmailRegistration" placeholder="Email" style="height:25px;width:240px;">
    </div>
  </div>
  <div class="control-group">
    <div class="controls">
      <input type="password" id="inputPasswordRegistration" form-validation="length" min-length-value="6" placeholder="Password" style="height:25px;width:240px;">
    </div>
  </div>  
  <div class="control-group">
    <div class="controls">
      <button id="registrationButton" type="submit" class="btn btn-info">Register</button>
    </div>
  </div>
</form>
</div>

<script>
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
        url: "http://localhost:8080/users/register",
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
</script>