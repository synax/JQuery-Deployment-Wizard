	
		function InitializeComputerConfiguration() {
		
			// Set Single Source Policy => Allow Cross Domain Requests
			$.support.cors = true;
			
			//Hide Error Box
			$("#getcomputernameerror").hide();	
		
			// Increase Animation Speed
			 $.fx.speeds._default = 1000;		 
					
			// Get Roles/Locations From AppPortal 
			GetLocations();				
			
			// Detect Client Type
			GetClientType();  		
					
			// Initialize Button Styles			
			$('button').button();	
					
			// Load Autocomplete Code
			loadAutocomplete();
			
			// Enable Autoselect Combobox		
			$("select").combobox();			
		
			$('#customSettings').button();
			
			$('#customSettingsLabel').hide();
						
					
			// Display Client Info	
			$("#sMacAddressField").text(oEnvironment.Item("MACAddress001"));     
			
			$('#ddAppPortalRole').val("empty");  
			
	  	
		
        	
				
        };
        
        function ValidateComputerConfiguration() {
        
        	oLogging.CreateEntry("Validation Startet....", LogTypeInfo);
        	
        	var validationResult = true;
        	
			if ($("#ddAppPortalRole").val() == null || $("#ddAppPortalRole").val() == "empty") {
				
				
				$("#locationconfig").addClass("ui-state-error", 300);
			

				oLogging.CreateEntry("No Role selected! Validation failed...", LogTypeInfo);
				
				validationResult = false;       	
			}
			
			if ($("#ddComputerPrefix").val() == null) {
				
				oLogging.CreateEntry("No Prefix selected! Validation failed...", LogTypeInfo);
				
				$("#computertypeconfig").addClass("ui-state-error", 300);
					

			
				validationResult = false;       	
			}
			
			var newComputerName = GetDeviceID();		
			
			if (newComputerName == "" || newComputerName == null) {
				
				$("#getcomputernameerror").text("Unable to get Computer name from Webservice. Please try again...");
				
				$("#getcomputernameerror").show();		
				
				validationResult = false; 
			
			} 		
			
			if (validationResult == true) 
			{ 			
				// Do Tasks if validation success
				oEnvironment.Item("KUO_LocationName") = $("#ddAppPortalRole option:selected").text();
				
				oEnvironment.Item("KUO_LocationId")  = $("#ddAppPortalRole").val();				
				
				oEnvironment.Item("KUO_ComputerTypeName") = $("#ddComputerPrefix option:selected").text();			
				
				oEnvironment.Item("KUO_ComputerTypePrefix") = $("#ddComputerPrefix").val();		
				
				oEnvironment.Item("OSDComputerName") = newComputerName;
				
				var RoleVariables = GetRoleVariables();		
				
				$.each(RoleVariables, function() {
					oEnvironment.Item(this.name) = this.value;
				});	

				var USMTRoleVariables = GetUSMTRoleVariables();
				
				$.each(USMTRoleVariables, function() {
					oEnvironment.Item(this.name) = this.value;
				});	
				
				
        
        	return validationResult;
			}
		
        };
        
 
// ------------------------- Functions ------------------------- 
        
     
	 var GetDeviceID = function ()
		{
        
				var deviceID;
		
                $.ajax({
			        type: "GET",
					async: false,
			        url:  oEnvironment.item("KUO_DeviceIDManagerUri") + '/GetDeviceID',
			        contentType: "text/xml; charset=utf-8",
			        data: {macAddress:oEnvironment.item("MacAddress001"),prefix:$( "#ddComputerPrefix" ).val()},
			        success: function (response) {
			            $('#result').html('success:');
			            $(response).find("ComputerNameFull").each(function () {			                     
			              
			               	deviceID = $(this).text();
			    			
							oLogging.CreateEntry("Got Computer Name from Webservice: " + deviceID, LogTypeInfo);		
							
									             
			            });
			        },
			        error: function (response) {
			            $('#result').html('failure:<br />' + response.responseText);			       
			        }
			    });	
				
				return deviceID
					
									
			    
		}
		
	function GetUSMTRoleVariables() {		
		
		var RoleVariables = [];
		
		var i = 0;
		
		$.ajax({
				type: "GET",
				async: false,
				url: oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/roles/5/variables' ,
				contentType: "text/json; charset=utf-8",			   
				success: function (response) {
					$('#result').html('success:');
					$(response).each(function () {
						
						if (this.ApplyTo == 'Target' || this.ApplyTo == 'Source and Target') {	            		
																					
							if (this.ApplyToBuildType == 'Not Specified' || this.ApplyToBuildType == 'Bare Metal Build') {
								var RoleVariable = {
									name: this.VariableName,
									value: this.VariableValue								
								};	
								
								RoleVariables[i] = RoleVariable;
								
								oLogging.CreateEntry("Got Variable from Webservice: Name='" + RoleVariable.name + "' | Value = '" + RoleVariable.value + "'", LogTypeInfo);	
								
								i++;
							}
						}
						
					});
				},
				error: function (response) {
					oLogging.CreateEntry("Request to Webservice " + oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/roles/5/variables' + " failed with: " + response.responseText, LogTypeInfo); 
				}
			});
						
		return RoleVariables;
		
	}
		
	function GetRoleVariables() {		
		
		var RoleVariables = [];
		
		var i = 0;
		
		$.ajax({
				type: "GET",
				async: false,
				url: oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/roles/' + $("#ddAppPortalRole").val() + '/variables' ,
				contentType: "text/json; charset=utf-8",			   
				success: function (response) {
					$('#result').html('success:');
					$(response).each(function () {
						
						if (this.ApplyTo == 'Target' || this.ApplyTo == 'Source and Target') {	            		
																					
							if (this.ApplyToBuildType == 'Not Specified' || this.ApplyToBuildType == 'Bare Metal Build') {
								var RoleVariable = {
									name: this.VariableName,
									value: this.VariableValue								
								};	
								
								RoleVariables[i] = RoleVariable;
								
								oLogging.CreateEntry("Got Variable from Webservice: Name='" + RoleVariable.name + "' | Value = '" + RoleVariable.value + "'", LogTypeInfo);	
								
								i++;
							}
						}
						
					});
				},
				error: function (response) {
					alert($('#result').html('failure:<br />' + response.responseText));
				}
			});
						
		return RoleVariables;
		
	}
	
	
	function GetLocations() {
	
			 
		$('#ddAppPortalRole').empty();
		
		$('#ddAppPortalRole').append('<option class="ui-compobox-item" value="empty"></option>');  	            	

		$.ajax({
				type: "GET",
				async: false,
				url: oEnvironment.item("KUO_AppPortalExtensionUri") + '/api/roles' ,
				contentType: "text/json; charset=utf-8",			   
				success: function (response) {
					$('#result').html('success:');
					$(response).each(function () {			               
										   
								   
						$('#ddAppPortalRole').append('<option class="ui-compobox-item" value="'+ this.RoleId + '">' + this.RoleName + '  | ' + this.RoleDescription + '</option>');  			               	            	
					   
						
					});
				},
				error: function (response) {
					$('#result').html('failure:<br />' + response.responseText);
				}
			});	
		  
		  
			
	}
	
	
	function GetClientType() {
		
	
			
			if (oEnvironment.Item("KUO_ClientType") == "DesktopsWinTPC" || oEnvironment.Item("KUO_ClientType") == "MobilesWinTPC")
			{
				oLogging.CreateEntry("Thin PC Deployment Detected", LogTypeInfo);
				
				if (oEnvironment.Item("IsDesktop") == "True") {
					oLogging.CreateEntry("Client is Desktop", LogTypeInfo);
					$("#ddComputerPrefix").val("T");		
				}
			
				if (oEnvironment.Item("IsLaptop") == "True") {
					oLogging.CreateEntry("Client is Laptop", LogTypeInfo);
					$("#ddComputerPrefix").val("N");		
				}

			}			
			else
			{
				oLogging.CreateEntry("Standard Deployment Detected", LogTypeInfo);
			
				if (oEnvironment.Item("IsVM") == "True") {	
					oLogging.CreateEntry("Client is Virtual Machine", LogTypeInfo);	
		        	$("#ddComputerPrefix").val("V");	        	
		    	}
		
		    	if (oEnvironment.Item("IsLaptop") == "True") {
		    		oLogging.CreateEntry("Client is Laptop", LogTypeInfo);
		        	$("#ddComputerPrefix").val("L");
		    	}
		
			    if (oEnvironment.Item("IsDesktop") == "True") {
			       oLogging.CreateEntry("Client is Desktop", LogTypeInfo);
			       $("#ddComputerPrefix").val("W");
				}
			}
			
			oLogging.CreateEntry("Device Type is now: " + $("#ddComputerPrefix").val() , LogTypeInfo);
		
		};
