
function InitializeRequestSelection() {

	// Set Single Source Policy => Allow Cross Domain Requests
	$.support.cors = true;
	
	// Get Packages From AppPortal
	
	GetPackages();	

	// Initialize Button Styles			
	$('button').button();
	
	// Load Autocomplete Code
	loadAutocomplete();
	
	// Enable Autoselect Combobox		
	$("#ddAppPortalItem").combobox();	
		
				  				
		
};


        
function ValidateRequestSelection() {

	oLogging.CreateEntry("Validation Startet....", LogTypeInfo); 
	
 	var validationResult = true;
 		
	if ($("#ddAppPortalItem").val() == null || $("#ddAppPortalItem").val() == "empty") {

		oLogging.CreateEntry("No Request selected! Validation failed...", LogTypeInfo);

		$("#deploymenttypeconfig").addClass("ui-state-error", 300);
		
		validationResult = false;   	
	};
	
	if (validationResult == true) { 
	
		// Do Things if validation success
		
		oEnvironment.Item("KUO_RequestName") = $("#ddAppPortalItem option:selected").text();
		
		oEnvironment.Item("KUO_RequestId") = $("#ddAppPortalItem").val();
		
		GetPackageCollection();
	
	 }
	        
	return validationResult;

};

// --------------- Functions -------------------------

function GetPackages() {

	$('#ddAppPortalItem').empty();
	
	$('#ddAppPortalItem').append('<option class="ui-compobox-item" value="empty"></option>');  	     
	
	$.ajax({
	        type: "GET",
			async: false,
	        url:  oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/packages?filter=' + oEnvironment.item("KUO_AppPortalOSDRequestFilter"),
	        contentType: "text/json; charset=utf-8",			   
	        success: function (response) {
	            $('#result').html('success:');
	            $(response).each(function () {              
	               	
					
					$('#ddAppPortalItem').append('<option value="'+ this.PackageId +'">' + this.PackageTitle + '</option>');   
	               	                             	
	            });
				
				$('#ddAppPortalItem').val("empty");
			},
	        error: function (response) {
	            $('#result').html('failure:<br />' + response.responseText);
		
	            oLogging.CreateEntry("Item is: " + oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/packages?filter=' + oEnvironment.item("KUO_AppPortalOSDRequestFilter"), LogTypeInfo);   

	        }
	    });	  
}

function GetPackageCollection() {

	$.ajax({
	        type: "GET",
			async: false,
	        url:  oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/packages/' + $("#ddAppPortalItem").val(),
	        contentType: "text/json; charset=utf-8",			   
	        success: function (response) {
	            $('#result').html('success:');
	            $(response).each(function () {	              
				
	               	    oLogging.CreateEntry("Got CollectionID: " + this.CollectionID , LogTypeInfo);
						oEnvironment.Item("KUO_RequestCollection") = this.CollectionID;
	            });
	        },
	        error: function (response) {
	            $('#result').html('failure:<br />' + response.responseText);
	            oLogging.CreateEntry("Error getting Value for: " + oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/packages/' + $("#ddAppPortalItem").val());   

	        }
	    });	  
}
