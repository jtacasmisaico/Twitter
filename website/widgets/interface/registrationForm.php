<div id="registerationDiv" style="display:none;">
    <h4 style="text-align:center">New to Twitter? Sign up!</h4>
    <form id="registrationForm" class="form-horizontal" onsubmit="return _$.utils.validateRegistrationForm()" onkeypress="return _$.utils.checkKey_$.authentication.register(event)">
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