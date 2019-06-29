/* eslint-disable prefer-const */
/* eslint-disable quotes */
/* eslint-disable indent */
const express = require('express');
const router = express.Router();
const url = require('url');
const postgresURL = process.env.POSTGRES_URL;
const PostGres = require('pg');
const pg = new PostGres.Client(postgresURL);
const mongo = require('./utils/mongodb_ItemFunctions');
const LineMiddleware = require('@line/bot-sdk').middleware;
const LineClient = require('@line/bot-sdk').Client;
const MAL = require('./malScrape');
const XRegExp = require('xregexp');

// Utility Library
const b64transcoder = require('./utils/Base64Transcoder');

// LINE
const configLine = {
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
	channelSecret: process.env.LINE_SECRET,
};
let malPage1 = {
  "type": "bubble",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Awoo's MyAnimeList Scraper - 1",
      },
    ],
  },
  "hero": {
    "type": "image",
    "url": "https://cdn.myanimelist.net/images/anime/5/82890.jpg",
    "size": "5xl",
    "aspectRatio": "25:35",
    "aspectMode": "cover",
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "<TITLE HERE>",
        "weight": "bold",
        "size": "xl",
      },
      {
        "type": "box",
        "layout": "baseline",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "Rating",
            "flex": 1,
          },
          {
            "type": "text",
            "text": "<INSERT RATING HERE>",
          },
        ],
      },
      {
        "type": "separator",
      },
      {
        "type": "box",
        "layout": "vertical",
        "margin": "lg",
        "spacing": "sm",
        "contents": [
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Genre",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
              },
              {
                "type": "text",
                "text": "Slice of Life,Comedy,School,Shounen",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5,
              },
            ],
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Eps",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
              },
              {
                "type": "text",
                "text": "10:00 - 23:00",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5,
              },
            ],
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Studio",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
              },
              {
                "type": "text",
                "text": "10:00 - 23:00",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5,
              },
            ],
          },
          {
            "type": "box",
            "layout": "baseline",
            "spacing": "sm",
            "contents": [
              {
                "type": "text",
                "text": "Status",
                "color": "#aaaaaa",
                "size": "sm",
                "flex": 1,
              },
              {
                "type": "text",
                "text": "10:00 - 23:00",
                "wrap": true,
                "color": "#666666",
                "size": "sm",
                "flex": 5,
              },
            ],
          },
        ],
      },
      {
        "type": "separator",
      },
      {
        "type": "text",
        "text": "Synopsis",
        "margin": "sm",
      },
      {
        "type": "separator",
      },
      {
        "type": "text",
        "text": "Swipe Right",
        "margin": "lg",
        "size": "sm",
        "color": "#666666",
        "wrap": true,
      },
    ],
  },
};
let malPage2 = {
  "type": "bubble",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Awoo's MyAnimeList Scraper - 2",
      },
    ],
  },
  "hero": {
    "type": "image",
    "url": "https://cdn.myanimelist.net/images/anime/5/82890.jpg",
    "size": "full",
    "aspectRatio": "25:5",
    "aspectMode": "cover",
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Synopsis",
        "margin": "sm",
      },
      {
        "type": "separator",
      },
      {
        "type": "text",
        "text": "",
        "margin": "lg",
        "size": "xs",
        "color": "#666666",
        "wrap": true,
      },
    ],
  },
};
let malPage3 = {
  "type": "bubble",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Voice Actors",
      },
    ],
  },
  "hero": {
    "type": "image",
    "url": "https://cdn.myanimelist.net/images/anime/5/82890.jpg",
    "size": "full",
    "aspectRatio": "25:5",
    "aspectMode": "cover",
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "margin": "lg",
    "spacing": "sm",
    "contents": [
      {
        "type": "box",
        "layout": "baseline",
        "spacing": "sm",
        "contents": [],
      },
    ],
  },
};
const malPage4 = {
  "type": "bubble",
  "header": {
    "type": "box",
    "layout": "vertical",
    "contents": [
      {
        "type": "text",
        "text": "Opening/Ending",
      },
    ],
  },
  "hero": {
    "type": "image",
    "url": "https://cdn.myanimelist.net/images/anime/5/82890.jpg",
    "size": "full",
    "aspectRatio": "25:5",
    "aspectMode": "cover",
  },
  "body": {
    "type": "box",
    "layout": "vertical",
    "margin": "lg",
    "spacing": "sm",
    "contents": [
      {
        "type": "box",
        "layout" : "vertical",
        "flex" : 1,
        "contents" : [
          {
        "type" : "text",
        "text" : "Opening",
      },
      {
        "type" : "separator",
      },
      {
        "type": "box",
        "layout": "baseline",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "Character",
            "color": "#aaaaaa",
          },
          {
            "type": "text",
            "text": "Voice Actor",
            "color": "#666666",
          },
        ],
      },
          ],
      },
      {
        "type" : "box",
        "layout" : "vertical",
        "flex" : 1,
        "contents" : [
      {
        "type" : "text",
        "text" : "Ending",
      },
      {
        "type" : "separator",
      },
      {
        "type": "box",
        "layout": "baseline",
        "spacing": "sm",
        "contents": [
          {
            "type": "text",
            "text": "Character",
            "color": "#aaaaaa",
          },
          {
            "type": "text",
            "text": "Voice Actor",
            "color": "#666666",
          },
        ],
      },
          ],
      },
    ],
  },
};

const lineClient = new LineClient(configLine);
// End of LINE

/* pg.connect((err) => {
	if (err) {
		return console.error('Can\'t connect to postgres database');
	}
	else {
		return console.log('Berhasil terhubung dengan postgres database');
	}
}); */


router.use(express.static('./public'));

router.get('/anime', (req, res) => {
    res.statusCode = 200;
    res.send({
        message : 'Connected!',
    });
});

router.get('/about', (req, res) => {
  res.sendFile(__dirname + '/public/about.html');
});

router.get('/aniUpdaterAPI', (req, res) => {
    const url_params = url.parse(req.url, true);
    console.log('GET request to /aniUpdaterAPI');
    console.log('Raw Params : ' + req.url);
    console.log('Parsed URL : ');
    console.log(url_params.query);

    // Call to OBJ in database

    res.send('Teehee~');
});

router.get('/getanime/:query', (req, res) => {
    const url_params = req.params.query;
    const decodedString = b64transcoder.decode(url_params);
    const newUrl = '/getanime/' + decodedString;
    res.statusCode = 300;
    res.redirect(newUrl);
});

router.get('/getanime/', (req, res) => {
    const url_params = url.parse(req.url, true);
    if (url_params.query.query == 'aaaa') {
        res.send('Hey, you found me!');
    }
    else {
        res.send('404 Not Found.');
    }
});

router.get('/api/', (req, res) => {
    const url_params = url.parse(req.url, true);
    const processedTitle = url_params.query.title.split(/(?=[A-Z])/);
    const newTitleWithWhitespace = processedTitle.join('.*');
    const titleRegexp = new RegExp('.*' + newTitleWithWhitespace + '.*', 'i');
    const jsonObj = {
        rawTitle : url_params.query.title,
        episode : url_params.query.ep,
        processedTitleArray : processedTitle,
        searchString : newTitleWithWhitespace,
        titleRegexp: titleRegexp,
        statusCode : res.statusCode,
    };
    mongo.mongoSearchEpisodeItem(jsonObj.titleRegexp, jsonObj.episode, (result) => {
        res.send(result);
    });

});

router.post('/lineAPI', LineMiddleware(configLine), (req, res) => {
    console.log('Event Type : ', req.body.events[0].type);
    const source = req.body.events[0].source;
    const eventZero = req.body.events[0];
    const replyToken = req.body.events[0].replyToken;
    let jsonMessage = {
        type: 'text',
        text: '',
    };


    if (req.body.events[0].type == 'join') {
        console.log('Join event has thrown. Joined a ' + eventZero.type);
        if (eventZero.type == 'room') {
            console.log('Room ID : '. eventZero.sourceId);
        }
        else {
            console.log('Group ID : ', eventZero.groupId);
        }
        lineClient.replyMessage(req.body.events[0].replyToken, {
            type: 'text',
            text: 'Awoo?\n\n Awoo!',
        });
        res.statusCode = 200;
    }

    if (req.body.events[0].type == 'message') {
        const message = req.body.events[0].message.text;

        if (message.match(/^!mal-s/)) {
          const regexp = XRegExp.exec(message, /^!mal\s(.*)/i);
          let query = regexp[1];
        }

        // Flex Message test
        if (message.match(/!mal/)) {
            let query;
            let flag = 'TV';
            let authorized = false;
            if (message.match(/-src/)) {
                const regexp = XRegExp.exec(message, /^!mal\s(.*)-src\s(.*)/i);
                query = regexp[1];
                flag = regexp[2];
                if (flag.match(/ova/i) || flag.match(/ona/i)) {
                    authorized = false;
                }
                else {
                    authorized = true;
                }
            }
            else {
                const regexp = XRegExp.exec(message, /^!mal\s(.*)/i);
                query = regexp[1];
                authorized = true;
            }
            // retrieve data using search query
            if (authorized) {
                MAL.malSearchAndNav(query, flag).then(malResp => {
                    // make flex message
                    
                    // New message - Page 1
                    malPage1.hero.url = malResp.poster_img;
                    malPage1.body.contents[0].text = malResp.title;
                    malPage1.body.contents[1].contents[1].text = malResp.score;
                    malPage1.body.contents[3].contents[0].contents[1].text = malResp.genres;
                    malPage1.body.contents[3].contents[1].contents[1].text = malResp.episodes;
                    malPage1.body.contents[3].contents[2].contents[1].text = malResp.studio;
                    malPage1.body.contents[3].contents[3].contents[1].text = malResp.airing_status;
                    // Page 2
                    malPage2.hero.url = malResp.poster_img;
                    malPage2.body.contents[2].text = malResp.synopsis;
                    // Page 3
                    malPage3.hero.url = malResp.poster_img;
                      malPage3.body.contents.length = 0;
                      for (let i = 0; i < malResp.charaVA.length; i++) {
                        const baseLineLayer = {
                          "type" : "box",
                          "layout" : "baseline",
                          "spacing" : "sm",
                          "contents" : [],
                        };
                        const chartexObj = {
                          "type" : "text",
                          "text" : malResp.charaVA[i].char,
                          "color" : "#aaaaaa",
                          "wrap" : true,
                        };
                        const vaTexObj = {
                          "type" : "text",
                          "text" : '',
                          "color" : "#666666",
                          "wrap" : true,
                        };
                        if (malResp.charaVA[i].va == undefined) {
                          vaTexObj.text = 'No data';
                        }
                        else {
                          vaTexObj.text = malResp.charaVA[i].va;
                        }
                        baseLineLayer.contents.push(chartexObj);
                        baseLineLayer.contents.push(vaTexObj);
                        malPage3.body.contents.push(baseLineLayer);
                      }
                      console.log(malPage3);

                    // Constructor
                    const flex = {
                      'type' : 'flex',
                      'altText' : 'MyAnimeList Search Result',
                      'contents' : {
                        "type" : 'carousel',
                        "contents" : [
                          malPage1, malPage2, malPage3,
                      ],
                    },
                    };
                    // send as reply
                    lineClient.replyMessage(replyToken, flex);
                });
            }
            else {
                lineClient.replyMessage(replyToken, { type: 'text', text: 'That flag is unauthorized in this place, baka.' });
            }
        }

        // End of flex message test

        if (message.match(/\buwu\b/i)) {
            jsonMessage.text = 'uwu';
            lineClient.replyMessage(req.body.events[0].replyToken, jsonMessage);
        }

        if (source.groupId == 'C0e62bac4ca0694fe2fa314244dcb16e6' && message == 'getMembers') {
            const idArray = new Array();
            lineClient.getGroupMemberIds('C0e62bac4ca0694fe2fa314244dcb16e6')
                .then((ids) => {
                    ids.forEach((id) => idArray.push(id));
                    jsonMessage.text = idArray.toString();
                    lineClient.replyMessage(replyToken, jsonMessage);
                })
                .catch((err) => {
                    jsonMessage.text = 'Error on retrieving group member userIds. perhaps \n' + toString(err);
                    lineClient.replyMessage(replyToken, jsonMessage);
                });
        }

        if (message.match(/\bowo\b/i)) {
            jsonMessage.text = 'What\'s this?';
            lineClient.replyMessage(req.body.events[0].replyToken, jsonMessage);
        }

        if (message.match(/\bgood job @*awoo\b/i)) {
            const jsonImage = {
                type : 'image',
                originalContentUrl : 'https://66.media.tumblr.com/9b0521b45e831131b2e5f11c32aadd17/tumblr_pf0367rBGu1qd5xzso1_400.png',
                previewImageUrl : 'https://cdn.discordapp.com/attachments/538788321267286036/551995790109835264/unknown.png',
            };
            lineClient.replyMessage(req.body.events[0].replyToken, jsonImage);
        }

        if (message == '!invoke' && source.type == 'user' && source.userId == 'Ua2b5c1dec66e8d3decae6e1d79ee89c9') {
            jsonMessage.text = 'Message invoked from console user account. Hmmph..';
            lineClient.pushMessage('Rd4502566c5ebf63b596bb45d8d58efd7', jsonMessage);
        }

        if (message == '!addGroup' && source.type == 'group') {
            mongo.mongoAddGroup(source.groupId, result => {
                jsonMessage.text = result;
                lineClient.replyMessage(replyToken, jsonMessage);
            });
        }

        if (message.match(/^!sub\s(.*)/i)) {
            const regexped = message.match(/^!sub\s(.*)/i);
            const title = regexped[1];
            if (source.type == 'room') {
                console.log('!sub command from room');
                mongo.mongoSearchForTitleToSub(title, source.roomId, result => {
                    console.log(result);
                    jsonMessage.text = result;
                    lineClient.replyMessage(replyToken, jsonMessage);
                });
            }
            else if (source.type == 'group') {
                console.log('!sub command from group');
                mongo.mongoSearchForTitleToSub(title, source.groupId, result => {
                    console.log(result);
                    jsonMessage.text = result;
                    lineClient.replyMessage(replyToken, jsonMessage);
                });
            }
            else if (source.type == 'user') {
                console.log('!sub command from user');
                mongo.mongoSearchForTitleToSub(title, source.userId, result => {
                    console.log(result);
                    jsonMessage.text = result;
                    lineClient.replyMessage(replyToken, jsonMessage);
                });
            }
        }

        if (message.match(/^!unsub\s(.*)/i)) {
            const regexped = message.match(/^!unsub\s(.*)/i);
            const title = regexped[1];
            if (source.type == 'room') {
                mongo.mongoSearchForTitleToUnsub(title, source.roomId, result => {
                    console.log(result);
                    jsonMessage.text = result;
                    lineClient.replyMessage(replyToken, jsonMessage);
                });
            }
            else if (source.type == 'group') {
                mongo.mongoSearchForTitleToUnsub(title, source.groupId, result => {
                    console.log(result);
                    jsonMessage.text = result;
                    lineClient.replyMessage(replyToken, jsonMessage);
                });
            }
            else if (source.type == 'user') {
                mongo.mongoSearchForTitleToUnsub(title, source.userId, result => {
                    console.log(result);
                    jsonMessage.text = result;
                    lineClient.replyMessage(replyToken, jsonMessage);
                });
            }
        }

        if (message == '!rtrdSwtch' && source.type == 'group') {
            mongo.mongoGroupRetardPref(source.groupId, result => {
                console.log(result);
                jsonMessage.text = result;
                lineClient.replyMessage(replyToken, jsonMessage);
            });
        }


        if (message == 'Group.Prefs' && source.type == 'group') {
            jsonMessage = {
                type: 'text',
                text: 'text',
            };
            mongo.mongoGroupPrefs(source.groupId, (status, mongoMessage) => {
                if (status == 'error') {
                    jsonMessage.text = mongoMessage;
                }
                else if (status == 'failed') {
                    jsonMessage.text = mongoMessage;
                }
                else if (status == 'success') {
                    jsonMessage.text = 'Group ID : ' + mongoMessage.groupid + '\nRetarded Mode : ' + mongoMessage.retardMode;
                }
                else {
                    jsonMessage.text = 'Corner case?';
                }

                lineClient.replyMessage(replyToken, jsonMessage);
            });
        }

        if (eventZero.message.text == 'Source.GetData') {
            console.log('message == Source.GetData');
            if (req.body.events[0].source.type == 'group') {
                jsonMessage = {
                    type: 'text',
                    text: 'Source : ' + source.type + '\nSource ID : ' + source.groupId,
                };
            }
            else if (req.body.events[0].source.type == 'room') {
                jsonMessage = {
                    type: 'text',
                    text: 'Source : ' + source.type + '\nSource ID : ' + source.roomId,
                };
            }
            else {
                jsonMessage = {
                    type: 'text',
                    text: 'Source : ' + source.type + '\nSource ID : ' + source.userId,
                };
            }
            lineClient.replyMessage(req.body.events[0].replyToken, jsonMessage);

        }
        res.statusCode = 200;
    }
    else {
        console.log('message !== Source.GetData');
        res.statusCode = 200;
    }

});

router.get('/lineAPI', (req, res) => {
    res.send('This endpoint is supposed to be used with POST request, not GET');
});

module.exports = router;