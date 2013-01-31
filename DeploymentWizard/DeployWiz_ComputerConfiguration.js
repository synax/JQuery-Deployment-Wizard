	
		function InitializeComputerConfiguration() {
		
			// Set Single Source Policy => Allow Cross Domain Requests
			$.support.cors = true;
			
			//Hide Error Box
			$("#getcomputernameerror").hide();	
		
			// Increase Animation Speed
			 $.fx.speeds._default = 1000;		 
					
			// Initialize Button Styles			
			$('button').button();	
					
			// Load Autocomplete Code
			loadAutocomplete();										
			
			$('input').addClass("ui-corner-all"); 
			
			// Display Client Info	
			$("#sMacAddressField").text(oEnvironment.Item("MACAddress001")); 

			$('#computerName').val(oEnvironment.Item("OSDComputerName"));
        	
				
        };
        
        function ValidateComputerConfiguration() {
        
        	oLogging.CreateEntry("Validation Startet....", LogTypeInfo);
        	
        	var validationResult = true;
        	
			if ($("#computerName").val() == null) {
				
				
				$("#computernameconfig").addClass("ui-state-error", 300);
			

				oLogging.CreateEntry("No Computer Name Defined! Validation failed...", LogTypeInfo);
				
				validationResult = false;       	
			}
			
					
			var newComputerName = $('#computerName').val()		
			
			if (newComputerName == "" || newComputerName == null) {
				
				$("#getcomputernameerror").text("Bitte einen Namen für den Computer eingeben!");
				
				$("#getcomputernameerror").show();		
				
				validationResult = false; 
			
			} 		
			
			if (validationResult == true) 
			{ 			
							
				oEnvironment.Item("OSDComputerName") = newComputerName;			
				
        
        	return validationResult;
			}
		
        };
        
 
// ------------------------- Functions ------------------------- 
        
     
