var slack = require('slack');

//in the future if we store everyones slack tokens in the encrypted in the database chage sendAsUser to true
//so that It can send as the user. 
function postMessage(postChannel, text) {
			var token = '';
			var channelID; //this will be the id of the channel to send to
			var sendAsUser = 'false'
			//get a list of all the channels to check that it is a channel, if it is not it attempts to send it as an IM
			slack.channels.list({token:token})
				.then((data) => {
					var flag = false;
					var channelID;
					for (i = 0; i<data.channels.length; i++) {
						if (postChannel.includes(data.channels[i].name_normalized)) {
							channelID = data.channels[i].id;
							flag = true;
							break;
						}
					}
					
					if (!flag) {
						//channel cant be found post an im instead
						postChannel = '@' + postChannel
						slack.chat.postMessage({token:token, channel:postChannel, text:text, as_user:sendAsUser}).then().catch(console.log)
					}
					else {
						slack.chat.postMessage({token:token, channel:channelID, text:text, as_user:sendAsUser}).then().catch(console.log)
					}
				})
				.catch((err) => {
					console.log("error loading channels: " + err);
				});
			
			
}

module.exports.postMessage = postMessage;
