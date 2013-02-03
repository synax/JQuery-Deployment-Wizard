
function InitializeRequestSelection() {

	// Set Single Source Policy => Allow Cross Domain Requests
	$.support.cors = true;
	
	// Get Packages From AppPortal
	
	GetOSDDeployments();	

	// Initialize Button Styles			
	$('button').button();
	
	// Load Autocomplete Code
	loadAutocomplete();
	
	// Enable Autoselect Combobox		
	$("#ddOSDDeployments").combobox();	
		
				  				
		
};


        
function ValidateRequestSelection() {

	oLogging.CreateEntry("Validation Startet....", LogTypeInfo); 
	
 	var validationResult = true;
 		
	if ($("#ddOSDDeployments").val() == null || $("#ddOSDDeployments").val() == "empty") {

		oLogging.CreateEntry("No Request selected! Validation failed...", LogTypeInfo);

		$("#deploymenttypeconfig").addClass("ui-state-error", 300);
		
		validationResult = false;   	
	};
	
	if (validationResult == true) { 
	
		// Do Things if validation success
		
		oEnvironment.Item("RED_RequestName") = $("#ddOSDDeployments option:selected").text();
		
		oEnvironment.Item("RED_RequestCollectionID") = $("#ddOSDDeployments").val();	
		
	
	 }
	        
	return validationResult;

};

// --------------- Functions -------------------------


var GetOSDDeployments = function ()
		{
        
		$('#ddOSDDeployments').empty();
	
		$('#ddOSDDeployments').append('<option class="ui-compobox-item" value="empty"></option>');  
		
	
                $.ajax({
			        type: "GET",
					async: false,
			        url:  oEnvironment.item("RED_MDTWebservice") + "/sccm.asmx/GetOSDCollections",
			        contentType: "text/xml; charset=utf-8",
			        data: {SiteCode:oEnvironment.item("RED_SCCMSiteCode")},
			        success: function (response) {
			            $('#result').html('success:');
			            $(response).find("Collection").each(function () {			                     
			              
			               	TaskSequenceCollectionID = $(this).find("CollectionID");
							TaskSequenceCollectionName = $(this).find("Name");
							
			    			
							$('#ddOSDDeployments').append('<option value="'+ TaskSequenceCollectionID.text() +'">' + TaskSequenceCollectionName.text() + '</option>');   
	
							
							oLogging.CreateEntry("Got Deployment from Webservice: " + TaskSequenceCollectionName.text() , LogTypeInfo);		
							
									             
			            });
			        },
			        error: function (response) {
					
						oLogging.CreateEntry("Webservice Request to " + oEnvironment.item("RED_MDTWebservice") + "/sccm.asmx/GetOSDCollections" + "failed with error:<br />" + response.responseText, LogTypeInfo);
			            	        
			        }
			    });					
									
			    
		}