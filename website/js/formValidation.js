$(function () {
	var inputFields = document.getElementsByTagName('input');
});

var validate = function(fieldId, event) {	
	var field = document.getElementById(fieldId);
	field.onkeyup = function(event) { validate(fieldId, event); };
	field.onblur = null;
	var validation = field.getAttribute('form-validation');
	var required = field.getAttribute('requiredField');
	if(required == "") {
		if(field.value.length < 1) {
			if(document.getElementById(fieldId+"_alert")==undefined) {
				var alertElement = document.createElement('p');
				alertElement.setAttribute('id',fieldId+"_alert");
				alertElement.setAttribute('class','text-warning');
				alertElement.setAttribute('style','display:none');
				alertElement.innerHTML = "Required Field";
				field.parentNode.appendChild(alertElement);
			}
			$('#'+fieldId+"_alert").show(200);			
			field.parentNode.parentNode.setAttribute('class','control-group warning');
			field.focus();
			return false;
		}
		else {
			if(document.getElementById(fieldId+"_alert")!=undefined)
				$('#'+fieldId+"_alert").hide();
			field.parentNode.parentNode.setAttribute('class','control-group');
			return true;
		}
	}
	if(validation == 'email') {		
		var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!filter.test(field.value)) {
			if(document.getElementById(fieldId+"_alert")==undefined) {
				var alertElement = document.createElement('p');
				alertElement.setAttribute('id',fieldId+"_alert");
				alertElement.setAttribute('class','text-warning');
				alertElement.setAttribute('style','display:none');
				alertElement.innerHTML = "Invalid Email ID";
				field.parentNode.appendChild(alertElement);
			}
			$('#'+fieldId+"_alert").show(200);			
			field.parentNode.parentNode.setAttribute('class','control-group warning');
			field.focus();
			return false;
		}
		else {
			if(document.getElementById(fieldId+"_alert")!=undefined)
				$('#'+fieldId+"_alert").hide();
			field.parentNode.parentNode.setAttribute('class','control-group');
			return true;
		}
	}
	if(validation == 'length') {
		if(field.value.length < field.getAttribute('min-length-value')) {
			if(document.getElementById(fieldId+"_alert")==undefined) {
				var alertElement = document.createElement('p');
				alertElement.setAttribute('id',fieldId+"_alert");
				alertElement.setAttribute('class','text-warning');
				alertElement.setAttribute('style','display:none');
				alertElement.innerHTML = "Minimum Length : "+field.getAttribute('min-length-value');
				field.parentNode.appendChild(alertElement);
			}
			$('#'+fieldId+"_alert").show(200);		
			field.parentNode.parentNode.setAttribute('class','control-group warning');
			field.focus();
			return false;
		}
		else {
			if(document.getElementById(fieldId+"_alert")!=undefined)
				$('#'+fieldId+"_alert").hide();
			field.parentNode.parentNode.setAttribute('class','control-group');
			return true;
		}
	}
}