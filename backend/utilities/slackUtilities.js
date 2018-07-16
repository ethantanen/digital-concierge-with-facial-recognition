function postMessage(var channel, var text) {
			var apiUrl = "https://slack.com/api/chat.postMessage";
			var token = "xoxp-366481641941-370889279687-397840544053-05454a11ce6593938ae9b8026f248354";
			var actualToken = "Bearer " + token;
			
			
			 $.ajax({                   
    				data: {
        			"token": token,
       			"channel": channel,
        			"text": text,
       			"as_user":"false"
   				},                      
    				dataType: 'text',
   				type: 'POST',           
   				url: apiUrl,
    				error: function(xhr,status,error){              
        				console.log("error: " + error);
    				},
    				success: function(data) {
        				console.log("result: " + data);
    				}
			});
}

module.exports={postMessage:postMessage};
