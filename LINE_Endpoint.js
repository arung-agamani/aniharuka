const line = require('@line/bot-sdk').Client;

const config = {
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
	channelSecret: process.env.LINE_SECRET,
};

const lineClient = new line(config);

module.exports.echo = function(inputJSON, callback) {
	console.log('Echo-ing text reply from LINE bot');
	console.log('Input : ');
	console.log(inputJSON);

	const replyMsg = {
		type: 'text',
		text: 'Oi',
	};

	callback(replyMsg);
};

module.exports.invokeLine = function(recipient) {
	lineClient.pushMessage(recipient, {
		type: 'text',
		text: 'Message sent from discord channel',
	});
};

module.exports.pushAnimeUpdate = function(recipient, title, episode, isRetard = false) {
	console.log('Push Anime Update to LINE event triggered.');
	let jsonMessage = {};
	if (isRetard == true) {
		const RNG = Math.random();
		if (RNG >= 0 && RNG < 0.3) {
			jsonMessage = {
				type: 'text',
				text: 'A-awooo!! OwO *notices new episode*\nO-onii-chan, there is a new content available for download...\nI\'mn not doing this because I want you to be more weeb or anything... b-baka >///< \n\n' + title + '\nEpisode : ' + episode,
			};
		}
		else if (RNG >= 0.3 && RNG < 0.5) {
			jsonMessage = {
				type: 'text',
				text: 'Welcome home, Goshujin-sama!\nWould you like a bath?\nWould you like to eat?\nOr would you like the latest episode of\n\n' + title + '\nEpisode : ' + episode,
			};
		}
		else if (RNG >= 0.5 && RNG < 0.7) {
			jsonMessage = {
				type: 'text',
				text: 'Goshujin-Sama!\nI\'ve washed the dishes, the clothes, and cleaned up~\nAh, I also found that\n' + title + '\nEpisode : ' + episode + '\nHas been released! Rejoice',
			};
		}
		else if (RNG >= 0.7) {
			jsonMessage = {
				type: 'text',
				text: 'Stop dreaming and return to Reality.\nBecause\n' + title + '\nEpisode : ' + episode + '\nHas been released! Rejoice',
			};
		}
		lineClient.pushMessage(recipient, jsonMessage);
	}
	else {
		jsonMessage = {
			type: 'text',
			text: 'New Release!\n' + title + '\nEpisode : ' + episode + '.',
		};
		lineClient.pushMessage(recipient, jsonMessage);
	}
};


/**
	 * 1. um....
	 * 2. oke
	 * 3. pull data from database
	 * 		would have this structure :
	 * 		{
	 * 			userid, retardMode, subbedItems { item1, item2, item3 }
	 * 		}
	 * 4. then.... deserialize
	 * 5. then post using pushAnimeUpdate
	 */

// pull data from database
