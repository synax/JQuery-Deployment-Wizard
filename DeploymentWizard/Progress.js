	
$(document).ready( function() {

	// Set Single Source Policy => Allow Cross Domain Requests
	$.support.cors = true;

	$("#Spin").progressbar({
            value: 10
        });
		
	
	
	$("#Title").position({
		my: "bottom",
		at: "bottom",
		of: "#MyContentArea"
	});
	
	$("#Spin").position({
		my: "right",
		at: "right",
		of: "#Title"
	});	
	
		
	$().toastmessage('showToast',{
			text     : 'Computer wird der Deployment Collection hinzugefügt...',
			sticky   : false,
			stayTime:  5000, 
			position : 'middle-center',
			type     : 'notice',
			close	 : function () { AddComputerToCollection();}
			
	});	

});

var RefreshCollection = function ()
{
	var result;
	
	// Refresh All Systems Collection
	oEnvironment.item("REFRESHSUBCOLLECTIONS") = "false";
	oEnvironment.item("ALLSYSTEMSCOLLECTIONID") = "SMS00001";

	 $.ajax({
		type: "GET",
		async: true,
		url:  oEnvironment.item("RED_MDTWebservice") + '/sccm.asmx/RefreshCollection',
		contentType: "text/xml; charset=utf-8",
		data: {
				RefreshSubcollections:oEnvironment.Item("REFRESHSUBCOLLECTIONS"),
				SiteCode:oEnvironment.Item("RED_SCCMSiteCode"),
				CollectionID:oEnvironment.Item("ALLSYSTEMSCOLLECTIONID")
		
		},
		success: function (response) {
			$('#result').html('success:');
			$(response).find("boolean").each(function () {			                     
			  
				result = $(this).text();
				
				oLogging.CreateEntry("Refresh for collection " + oEnvironment.Item("ALLSYSTEMSCOLLECTIONID") + " initiated with result: " + result, LogTypeInfo);		
				
				$("#Spin").progressbar({
					value: 50
				});
	
									
				// Wait for Advertisement
				oLogging.CreateEntry ("Waiting for Advertisement", LogTypeInfo);
				
				HasAdvertisement();						
									 
			});
		},
		error: function (response) {
		
			oLogging.CreateEntry ("Refresh of collection " + oEnvironment.Item("COLLECTIONID") + " failed... you need to wait for dynamic update (5 Minutes)", LogTypeError);
		
			oLogging.CreateEntry("Request to Webservice " + oEnvironment.item("RED_MDTWebservice") + '/sccm.asmx/RefreshCollection' + " failed with: " + response.responseText, LogTypeInfo);
			result = "error";          
		}
	});	
	
	
	return result;

};



var HasAdvertisement = function ()
		{
	var result;

	$.ajax({
		type: "GET",
		async: true,
		url:  oEnvironment.item("RED_MDTWebservice") + '/sccm.asmx/HasOSDAdvertisement',
		contentType: "text/xml; charset=utf-8",
		data: {
				macAddress:oEnvironment.item("MacAddress001"),
				UUID:oEnvironment.item("smsbiosGUID"),
				SiteCode:oEnvironment.item("RED_SCCMSiteCode")
		},
		success: function (response) {
			$('#result').html('success:');
			$(response).find("boolean").each(function () {			                     
			  
				result = $(this).text();	

				$("#Spin").progressbar({
					value: 80
				});				

				if (result  == "true" ) {
	
					$().toastmessage( 'showToast',{
						text     : 'Deployment bereit!',
						sticky   : true,
						type     : 'success'						
					});
					
					$("#Spin").progressbar({
						value: 100
					});	
					

					oLogging.CreateEntry ("Found a Task Sequence advertisement, waiting some more seconds...", LogTypeInfo);
												
					// Wait 15 more seconds, just in case
					$.doTimeout( 20000, function(){					
						
						oLogging.CreateEntry ("Pause finished, continue ...", LogTypeInfo);
										 
						window.close(); 

					});
				}else {
				
					$().toastmessage('showToast', {
						text     : 'Warten auf Deployment...',
						sticky   : false,
						stayTime:  10000, 
						position : 'top-center',
						type     : 'notice',
						close	 : function () { HasAdvertisement();}
					});
					
					oLogging.CreateEntry ("Sleeping 10 seconds to wait for a Task Sequence advertisement...", LogTypeInfo);
					
				};	
									
				oLogging.CreateEntry("Client has advertisement is: " + result, LogTypeInfo);		
				
									 
			});
		},
		error: function (response) {	
		
			oLogging.CreateEntry("Request to Webservice " + oEnvironment.item("RED_MDTWebservice") + '/sccm.asmx/HasOSDAdvertisement' + " failed with: " + response.responseText, LogTypeInfo);
			result = "error";     
		}
	});	
	
	
	return result;

};

var AddComputerToCollection = function ()
		{				
	var result;

	$.ajax({
		type: "GET",
		async: true,
		url:  oEnvironment.item("RED_MDTWebservice") + '/sccm.asmx/AddComputerToCollection',
		contentType: "text/xml; charset=utf-8",
		data: {
				macAddress:oEnvironment.item("MacAddress001"),
				UUID:oEnvironment.item("smsbiosGUID"),
				ComputerName:oEnvironment.item("OSDComputerName"),
				CollectionID:oEnvironment.item("RED_RequestCollectionID")
		
		},
		success: function (response) {
			$('#result').html('success:');
			$(response).find("boolean").each(function () {			                     
						
						
				result = $(this).text();
				
				$().toastmessage('showToast',{
					text     : 'Computer wurde erfolgreich in die Deployment Collection eingefügt.',
					sticky   : true,
					position : 'top-center',
					type     : 'success'
				});	
				
				$("#Spin").progressbar({
					value: 30
				});
				
				oLogging.CreateEntry ("Added computer " + oEnvironment.item("OSDComputerName") + " to collection " + oEnvironment.item("RED_RequestCollection") + " with result " + result, LogTypeInfo);
			
				RefreshCollection();
								 
			});
		},
		error: function (response) {
		
			$().toastmessage('showToast',{
				text     : 'Sorry, der Computer konnte nicht in die Deployment Collection eingefügt werden! Bitte später erneut versuchen...',
				sticky   : true,
				position : 'middle-center',
				type     : 'error'
			});

			oLogging.CreateEntry("Request to Webservice " + oEnvironment.item("RED_MDTWebservice") + '/sccm.asmx/AddComputerToCollection' + " failed with: " + response.responseText, LogTypeInfo);       
			result = "error";   
			
			oLogging.CreateEntry ("Could not add computer to deployment collection! Please try again later...", LogTypeInfo);
										
			// Wait 15 more seconds, just in case
			$.doTimeout( 20000, function(){					
		 
				window.close(); 

			});
		
		  
		}
	});	
	
	
	return result;
									
			    
};



     
		