	
		function InitializeSummary() {
		
			// Set Single Source Policy => Allow Cross Domain Requests
			$.support.cors = true;	

			// Initialize Button Styles			
			$('button').button();
			
			// Hide Request Summary if skiped
			if (oEnvironment.Item("RED_SkipRequestSelection") == "Yes") {
				
				$("#requestsummaryarea").hide();
			
			}
			else
			{
				$("#sRequestNameField").text(oEnvironment.Item("RED_RequestName"));
			}
			
							
			// Hide Request Summary if skiped			
	
			// Hide Request Summary if skiped
			if (oEnvironment.Item("RED_SkipComputerConfiguration") == "Yes") {
				
				$("#computerconfigurationsummaryarea").hide();
			
			}
			else
			{
				$("#sMacAddressField").text(oEnvironment.Item("MACAddress001")); 

					  	
				$("#sComputerNameField").text(oEnvironment.Item("OSDComputerName"));     		   
				
			}
				
        };
        
        function ValidateSummary() {
        
        	oLogging.CreateEntry("Validation Startet....", LogTypeInfo);
        	
        	var validationResult = true;
					
			if (validationResult == true) 
			{ 			
				// Do Tasks if validation success
				
				
			}		
        
        	return validationResult;
        
        };
        
 
// ------------------------- Functions ------------------------- 
        
     
		