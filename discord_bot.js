/* eslint-disable quotes */
const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const GetFeed = require('./utils/GetFeed');
const CompArr = require('./utils/CompareArray');
const regexMongoItemAdd = require('./utils/regexAnimeItem');
const lineModules = require('./LINE_Endpoint');
const XRegExp = require('xregexp');
const mongoItem = require('./utils/mongodb_ItemFunctions');
const mal = require('./malScrape');
const request = require('request');
const PostGres = require('pg');


let feedItems = new Array();
const filteredFeedItems = new Array();
let resultArray = new Array();
const itemAmount = 5;
const urlTestFeed = 'http://horriblesubs.info/rss.php?res=720';
const postgresURL = process.env.POSTGRES_URL;
const pg = new PostGres.Client(postgresURL);
const updateDuration = 300;
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'credentials.json';

let foundItemIndex;

const Switch = true;

// UWW server env. var
const UWW_GuildID = '339763195554299904';
// RSS Parser Initiate

Object.prototype.hasOwnProperty = function(property) {
	return typeof this[property] !== 'undefined';
};

pg.connect((err) => {
	if (err) {
		return console.error('Can\'t connect to postgres database');
	}
	else {
		return console.log('Berhasil terhubung dengan postgres database');
	}
});

bot.on('ready', () => {
    bot.guilds.get('339763195554299904').channels.get('538788321267286036').send('Logged in! uwu');
	if (Switch == true) {
		if (bot.guilds.get(UWW_GuildID).available) {
			console.log('Logged in.....');
			console.log('Starting timer event : RSSFeed. ' + updateDuration + ' seconds interval.');
			GetFeed.GetFeed(urlTestFeed, (err, feeds) => {
				if (!err) {
					// console.log ('There are ' + feeds.length + ' items in the feed.\n');
					feedItems = feeds;
				}
				else {
					console.log(err);
				}
			});
			setTimeout(() => {
				bot.guilds.get('339763195554299904').channels.get('538788321267286036').send('!extractFeed');
			}, 3000);
            bot.guilds.get('339763195554299904').channels.get('538788321267286036').send('!startFeed');
			// bot.guilds.get('339763195554299904').channels.get('457623320955977729').send('Just reminding y\'all to cekik a person with the name Fathi Kasih Firdaus');
		}
	}
});


function extractFromParticularTag() {
	filteredFeedItems.length = 0;
	for (let i = 0; i < feedItems.length; i++) {
		const feedItemsTitleLink = feedItems[i].title;
		const PublisherPrefixTag = '[HorribleSubs]';
		const Quality = '[720p]';
		// eslint-disable-next-line no-unused-vars
		const RegexpObj = XRegExp.exec(feedItemsTitleLink, /\[HorribleSubs\]\s(.*)\s-\s(\d+)\s\[720p\]\.mkv/);
		if (feedItemsTitleLink.indexOf(PublisherPrefixTag) !== -1 && feedItemsTitleLink.indexOf(Quality) !== -1) {

			const internalObject = {
				title : feedItems[i].title,
				link : feedItems[i].link,
				pubdate : feedItems[i].pubDate,
			};
			filteredFeedItems.push(internalObject);
			// console.log('Pushing ' + internalObject.title);
		}
	}
}
function authorize(credentials, callback) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id, client_secret, redirect_uris[0]);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client);
	});
}
function getAccessToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: SCOPES,
	});
	console.log('Authorize this app by visiting this url:', authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question('Enter the code from that page here: ', (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return callback(err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) console.error(err);
				console.log('Token stored to', TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}
function driveLoggedIn(imageName) {
	const drive = google.drive({ version: 'v3' });
	const metadata = {
		'name' : imageName + '.png',
	};
	const media = {
		mimeType : 'image/png',
		body : fs.createReadStream(imageName + '.png'),
	};
	drive.files.create({
		resource : metadata,
		media : media,
		fields : 'id',
	}, (err, file) => {
		if (err) {
			console.error(err);
		}
		else {
			console.log('File ID: ' + file.id);
		}
	});
}
bot.on('message', async (msg) => {
	const RichEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Trying to embed some stuffs')
	.setURL('https://aniharuka.herokuapp.com')
	.setAuthor('Anii-chan\'s Raping session', 'https://i.imgur.com/4EtUyKi.png', 'https://aniharuka.herokuapp.com')
	.setDescription('Onii-chan... dame..')
	.setThumbnail('https://i.imgur.com/4EtUyKi.png')
	.addField('I-ittai...', 'ahnn....')
	.addField('y-yamete...', 'aaahnnn')
	.setTimestamp()
	.setFooter('Footer.... nothing good here', 'https://i.imgur.com/4EtUyKi.png');

	if (msg.content.startsWith('!subs')) {
		const regexp = XRegExp.exec(msg.content, /!subs\s(.*)/);
		const userID = msg.author.id;
		const subscribedItem = regexp[1];
		mongoItem.mongoInsertUserItem(userID, subscribedItem, result => {
			msg.channel.send(result);
		});
	}

	if (msg.content.startsWith('!mal')) {
		let query;
            let flag = 'TV';
            if (msg.content.match(/-src/)) {
                const regexp = XRegExp.exec(msg.content, /^!mal\s(.*)-src\s(.*)/i);
                query = regexp[1];
                flag = regexp[2];
            }
            else {
                const regexp = XRegExp.exec(msg.content, /^!mal\s(.*)/i);
                query = regexp[1];
            }
		mal.malSearchAndNav(query, flag).then(malResponse => {
			// do something with the response here, wait
			console.log(malResponse);
			const MALEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setAuthor('MyAnimeList Search Result')
				.setTitle(malResponse.title)
				.setThumbnail(malResponse.poster_img)
				.setDescription(malResponse.synopsis)
				.addField('Score', malResponse.score)
				.addField('Genres', malResponse.genres)
				.addField('Episode', malResponse.episodes)
				.addField('Studio', malResponse.studio)
				.addField('Status : ', malResponse.airing_status);
			msg.channel.send({ embed : MALEmbed });
		});

	}

	if (msg.content == '!subList') {
		mongoItem.mongoUserSubsList(msg.author.id, result => {
			if (result.length == 0) {
				msg.channel.send('You have no subscribing list');
			}
			else {
				msg.channel.send('Your subscribing list :');
				for (let i = 0; i < result.length; i++) {
					msg.channel.send(result[i]);
				}
			}
		});
	}

	if (msg.content == '!guildID') {
		msg.channel.send(msg.guild.id);
	}

	if (((msg.content.length == 5) || (msg.content.length == 6)) && (isNaN(msg.content) == false) && msg.channel.id == '457628112490987530') {
		const prefix = 'https://nhentai.net/g/';
		const link = prefix + msg.content;
		const req = request(link);
		req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
		req.setHeader('accept', 'text/html,application/xhtml+xml');
		req.on('response', (res) => {
			bot.guilds.get('339763195554299904').channels.get('457628112490987530').send(link);
			console.log("Link with nuke code " + msg.content + " was checked and returns result with status code " + res.statusCode);
		});
		// test if exists
		// console.log(link);

	}

	if (msg.guild == null && (msg.content.length == 5 || 6) && (isNaN(msg.content) == false)) {
		const prefix = 'https://nhentai.net/g/';
		const link = prefix + msg.content;
		msg.author.send(link);
		console.log("link sent from guild == null section");
	}

	if (msg.content == '!channelID') {
		msg.channel.send(msg.channel.id);
	}
	if (msg.guild.id == UWW_GuildID) {
		const AnimuUpdateRole = msg.guild.roles.find(role => role.name === 'AnimuUpdates');
		// audit log
		if (msg.content === 'audit log') {
			const auditLogOption = {
				limit : '1',
			};
			const anotherLogger = msg.guild.channels.find(e => e.name === 'loli-paradise');
			const entry = await msg.guild.fetchAuditLogs(auditLogOption)
				.then(audit => audit.entries.first())
				.catch((err) => {console.log(err);});

			const date = entry.createdAt.toDateString();

			msg.channel.send('Audit log yg tercatat terakhir kali dibuat oleh ' + entry.executor.username, (err) => {
				console.log(err);
			});
			msg.channel.send('Writing down the.... apalah ini... GuildAuditLogsEntry');
			msg.channel.send('On ' + date + '. Action was targeted to ' + entry.targetType + ', to be specific to ' + entry.target);
			anotherLogger.send('This message is a result of new message being made in channel seberang');

		}
		// !feed
		if (msg.content == '!feed') {
			GetFeed.GetFeed(urlTestFeed, (err, feeds) => {
				if (!err) {
					console.log ('There are ' + feeds.length + ' items in the feed.\n');
					feedItems = feeds;
				}
				else {
					console.log(err);
				}
			});

		}


		if (msg.content == '!compare') {
			const SQL_Query = 'SELECT * FROM horrisubsrss ORDER BY urutan ASC';
			pg.query(SQL_Query, (err, res) => {
				if (err) {
					console.log(err);
				}
				else {
				// msg.channel.send('Item ' + (i + 1) + ' : ' + res.rows[i].title);
				// resultArray = res;
					setTimeout(() => {
						resultArray = res.rows;
						CompArr.compareArrays(resultArray, filteredFeedItems);
					}, 5000);
				}
			});
		}

		// !showFeedItems
		if (msg.content == '!showFeedItems') {
			msg.delete();
			extractFromParticularTag();
			msg.channel.send('feedItems[0].title =' + feedItems[0].title);
			msg.channel.send('There are ' + filteredFeedItems.length + ' items in the feed. The first five are :');
			// console.log(filteredFeedItems[0].title);
			for (let i = 0; i < itemAmount ; i++) {
				msg.channel.send((i + 1) + '. ' + filteredFeedItems[i].title);
			}
		}
		if (msg.content == '!extractFeed') {
			// msg.delete();
			extractFromParticularTag();
			console.log('Extracted the feed into separate array');
		}
		// !logFirstItem
		if (msg.content == '!logFirstItem') {
			console.log(feedItems[0].title);
		}

		if (msg.content == '!showFirstItem') {
			const title = filteredFeedItems[0].title;
			const dashPos = title.indexOf(' - ');
			const episode = title.slice(dashPos + 3, dashPos + 5);

			const HorribleEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle(filteredFeedItems[0].title)
				.setDescription('description here maybe?')
				.addField('Episode', episode)
				.addField('Torrent Link', '[Link here](' + filteredFeedItems[0].link + ')')
				.setFooter('HorribleSubs RSS Updater');
			msg.channel.send({ embed : HorribleEmbed });
			msg.channel.send(AnimuUpdateRole + '! New stuffs');
		}

		if (msg.content == '!showAll') {
			const SQL_Query = 'SELECT * FROM horrisubsrss ORDER BY urutan ASC';
			pg.query(SQL_Query, (err, res) => {
				if (err) {
					console.log(err);
				}
				else {
					setTimeout(() => {
						resultArray = res.rows;
						console.log('Finished processing query.');
						console.log(resultArray);
						CompArr.compareArrays(resultArray, filteredFeedItems, item => {
							foundItemIndex = item;
							console.log('Found Item Index : ', foundItemIndex);
						});
						console.log('Finish comparing');

						if (foundItemIndex.length !== 0) {
							for (let i = 0; i < foundItemIndex.length; i++) {
								const title = filteredFeedItems[0].title;
								const dashPos = title.indexOf(' - ');
								const episode = title.slice(dashPos + 3, dashPos + 5);

								const HorribleEmbed = new Discord.RichEmbed()
									.setColor('#0099ff')
									.setTitle(filteredFeedItems[0].title)
									.setDescription('')
									.addField('Episode', episode)
									.addField('Torrent Link', '[Link here](' + filteredFeedItems[0].link + ')')
									.setFooter('HorribleSubs RSS Updater');
								msg.channel.send({ embed : HorribleEmbed });

							// msg.guild.channels.find('name', 'illegal-logging').send('New Release! ' + TitleFeedArray[i]);
							// bot.channels.get(457872748140560384).send('New Release! ' + internalFeedArray[i]);
							}
							for (let i = 0; i < foundItemIndex.length; i++) {
								const SQL_Query_2 = 'UPDATE horrisubsrss SET title = \'' + filteredFeedItems[i].title + '\', guid = \'' + filteredFeedItems[i].guid + '\', link = \'' + filteredFeedItems[i].link + '\', pubdate = \'' + filteredFeedItems[i].pubdate + '\' WHERE urutan = ' + (i + 1) + ';';
								pg.query(SQL_Query_2);
								console.log('Adding data to row ' + (i + 1));
							}
							// msg.guild.channels.find('name', 'illegal-logging').send(AnimuUpdateRole + '! New stuffs yo.');
						// bot.channels.get(457872748140560384).send('Finished updating the database');

						}
						else if (foundItemIndex.length == 0) {
							console.log('No new items.');
						}
						feedItems.length = 0;
					}, 5000);
				}
			});
		}

		if (msg.content == '!alterFirstItem') {
			const SQL_Query = 'UPDATE horrisubsrss SET title = \'' + filteredFeedItems[10].title + '\' WHERE urutan = ' + (0 + 1) + ';';
			pg.query(SQL_Query, (err) => {
				if (err) {
					console.log(err);
				}
				else {console.log('Adding data to row ' + (0 + 1));}
			});
		}
		// add to database
		if (msg.content == '!pgUpdate') {
			let indexOfRegexpChanges = -1;
			for (let i = 0; i < 5; i++) {
				if (filteredFeedItems[i].title.indexOf("'") !== -1 && indexOfRegexpChanges == -1) {
					filteredFeedItems[i].title = filteredFeedItems[i].title.replace(/'/g, "''");
					indexOfRegexpChanges = i;
				}
				const SQL_Query = 'UPDATE horrisubsrss SET title = \'' + filteredFeedItems[i].title + '\', guid = \'' + filteredFeedItems[i].guid + '\', link = \'' + filteredFeedItems[i].link + '\', pubdate = \'' + filteredFeedItems[i].pubdate + '\' WHERE urutan = ' + (i + 1) + ';';
				pg.query(SQL_Query, (err) => {
					if (err) {
						console.log(err);
					}
					else {console.log('Adding data to row ' + (i + 1));}
				});
			}
			if (indexOfRegexpChanges !== -1) {
				filteredFeedItems[indexOfRegexpChanges].title = filteredFeedItems[indexOfRegexpChanges].title.replace(/''/g, "'");
			}
			msg.channel.send('Finished updating the database');
		}

		if (msg.content == 'invokeLine') {
			lineModules.invokeLine('C0e62bac4ca0694fe2fa314244dcb16e6');
		}


		// point trigger
		if (msg.content == '!startFeed') {
			// msg.delete();
			console.log('Start feed retrieving cycle');
			bot.setInterval(() => {
				console.log('Processing query results into separate array');
				const SQL_Query = 'SELECT * FROM horrisubsrss ORDER BY urutan ASC';
				GetFeed.GetFeed(urlTestFeed, (err, feeds) => {
					if (!err) {
						// console.log ('There are ' + feeds.length + ' items in the feed.\n');
						feedItems = feeds;
					}
					else {
						console.log('Cyclical feed retrieving.');
					}
				});
				pg.query(SQL_Query, (err, res) => {
					if (err) {
						console.log(err);
					}
					else {
						setTimeout(() => {
							resultArray = res.rows;
							console.log('Finished processing query.');
							extractFromParticularTag();
							// console.log(resultArray);
							CompArr.compareArrays(resultArray, filteredFeedItems, item => {
								foundItemIndex = item;
								console.log('Found items from callback : ' + foundItemIndex);
							});
							console.log('Finish comparing');

							if (foundItemIndex.length !== 0) {
								for (let k = 0; k < foundItemIndex.length; k++) {
									const i = foundItemIndex[k];
									const title = filteredFeedItems[i].title;
									const dashPos = title.indexOf(' - ');
									const episode = title.slice(dashPos + 3, dashPos + 5);
									console.log('Posted : ' + title);


									const DateNow = new Date();
									// const intervalTimezone = DateNow.getTimezoneOffset();
									const TimeNow = DateNow;

									const HorribleEmbed = new Discord.RichEmbed()
										.setColor('#0099ff')
										.setTitle(filteredFeedItems[i].title)
										.setDescription('')
										.addField('Episode', episode)
										.addField('Torrent Link', '[Link here](' + filteredFeedItems[i].link + ')')
										.setFooter('HorribleSubs RSS Updater. Posted on :' + TimeNow);
									msg.guild.channels.get('465401076137459724').send({ embed : HorribleEmbed });

								// msg.guild.channels.find('name', 'illegal-logging').send('New Release! ' + TitleFeedArray[i]);
								// bot.channels.get(457872748140560384).send('New Release! ' + internalFeedArray[i]);
								}
								let indexOfRegexpChanges = -1;
								const PG_Array_Length = resultArray.length;
								for (let k = 0; k < foundItemIndex.length; k++) {
									const i = foundItemIndex[k];
									if (filteredFeedItems[i].title.indexOf("'") !== -1 && indexOfRegexpChanges == -1) {
										filteredFeedItems[i].title = filteredFeedItems[i].title.replace(/'/g, "''");
										indexOfRegexpChanges = i;
									}
									// const SQL_Query_2 = 'UPDATE horrisubsrss SET title = \'' + filteredFeedItems[i].title + '\', guid = \'' + filteredFeedItems[i].guid + '\', link = \'' + filteredFeedItems[i].link + '\', pubdate = \'' + filteredFeedItems[i].pubdate + '\' WHERE urutan = ' + (i + 1) + ';';
									const SQL_Query_3 = 'INSERT INTO horrisubsrss (urutan, title, guid, link, pubdate) VALUES (' + (PG_Array_Length + 1 + k) + ', \'' + filteredFeedItems[i].title + '\', \'' + filteredFeedItems[i].guid + '\', \'' + filteredFeedItems[i].link + '\', \'' + filteredFeedItems[i].pubdate + '\');';
									// console.log(SQL_Query_3);
									pg.query(SQL_Query_3);
									try {
										regexMongoItemAdd.regexAnimePush(filteredFeedItems[i].title, filteredFeedItems[i].link);
									}
									catch (error) {
										console.log('Failed to add to mongoDB using regexAnimeGroup function');
									}
									console.log('Adding data to row ' + (i + 1));
								}
								if (indexOfRegexpChanges !== -1) {
									filteredFeedItems[indexOfRegexpChanges].title = filteredFeedItems[indexOfRegexpChanges].title.replace(/''/g, "'");
								}
								msg.guild.channels.get('465401076137459724').send('! New stuffs yo.');
								// msg.guild.channels.find('name', 'illegal-logging').send('Update Event triggered.');
							// bot.channels.get(457872748140560384).send('Finished updating the database');

							}
							else if (foundItemIndex.length == 0) {
								console.log('No new items.');
							}
							feedItems.length = 0;
						}, 5000);
					}
				});


			}, updateDuration * 1000);
		}

		if (msg.content == '!embed') {
			msg.channel.send({ embed : RichEmbed });
		}

		if (msg.content == '!upload') {
			fs.readFile('google_client_secret.json', (err, content) => {
				if (err) {
					return console.log('Error on reading the credentials');
				}
				authorize(JSON.parse(content), driveLoggedIn);
				msg.channel.send('dummy file uploaded succesfully');
			});
		}
	}
});

bot.on('channelCreate', async (chl) => {

	const targetChannel = chl.guild.channels.find('name', 'server-log');
	if (targetChannel !== null) {
		targetChannel.send('A new channel has been created =>' + chl, {
			file : 'https://cdn.discordapp.com/attachments/339774852414177280/456539380882866193/unknown.png',
		});
		targetChannel.send('Channel ID : ' + chl.id);
	}

});

bot.on('channelDelete', async (chl) => {
	const targetChannel = chl.guild.channels.find('name', 'server-log');
	if (targetChannel !== null) {
		targetChannel.send('A channel was deleted. Can\'t retrieve any info on which one.');
		targetChannel.send('Nee nee... de kita ne.... Ne?', {
			file : 'https://cdn.discordapp.com/attachments/339774852414177280/456537578645094410/DflHehTWsAAYm-U.png',
		});
	}
});

bot.login(process.env.DISCORD_LOGIN);