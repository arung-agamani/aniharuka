/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable indent */
/**
 * A Regular Expression based Title grouping, using the processed data from GetFeed.js
 */

// Importing libraries
const XRegExp = require('xregexp');

// Importing files
const util_Mongo = require('./mongodb_ItemFunctions');
const lineModules = require('../LINE_Endpoint');

const mongo = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;


// Global Variables
const AnimeContainer = new Array();

// Object for containing the feeds
// Regular Expression
/**
 * Data Structure
 * 
 * Prefix : [HorribleSubs]
 * Suffix : [720p].mkv
 * Middle point(s) :
 * -- Episode count identificator, started with "-" with a space and followed with two or three numbers
 * Regex ^ -> \s-\s(\d+)\s[720p]\.mkv
 * 
 * Full regular expression :
 * \[HorribleSubs\]\s(.*)\s-\s(\d+)\s\[720p\]\.mkv
 */

// Extracting titles from feedItems

module.exports.regexAnimePush = function(str_title, link) {
    const RegexpObj = XRegExp.exec(str_title, /\[HorribleSubs\]\s(.*)\s-\s(\d+)\s\[720p\]\.mkv/);
    const title = RegexpObj[1];
    const animeObject = {
        title : title,
        epsNum : parseInt(RegexpObj[2]),
        link : link,
    };
    AnimeContainer.push(animeObject);
    console.log('AnimeContainer : ', AnimeContainer);
    util_Mongo.mongoAddAnimeItem(AnimeContainer);
    /**
     * Flow :
     * 1. Pull database data
     * 2. make for loop
     * 3. push for each(?)
     */
    /*
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        if (connectErr) {
            console.log('Error on connecting to Atlas db');
        }
        else {
            const db = client.db('aniHaruka');
            
            db.collection('lineGroupSetting').find({ retardMode : true }).toArray((findErr, findRes) => {
                if (findErr) {
                    console.log('Error on pulling lineGroupSetting data : ', findErr);
                }
                else if (findRes.length != 0) {
                    console.log('Found group list : ', findRes.length);

                    for (let i = 0; i < findRes.length; i++) {
                        const groupID = findRes[i].groupid;
                        if (groupID != 'aaaaa') {
                            lineModules.pushAnimeUpdate(groupID, animeObject.title, animeObject.epsNum, true);
                        }                        
                    }
                }
            });

            db.collection('lineGroupSetting').find({ retardMode : false }).toArray((findErr, findRes) => {
                if (findErr) {
                    console.log('Error on pulling lineGroupSetting data : ', findErr);
                }
                else if (findRes.length != 0) {
                    for (let i = 0; i < findRes.length; i++) {
                        const groupID = findRes[i].groupid;
                        if (groupID != 'aaaaa') {
                            lineModules.pushAnimeUpdate(groupID, animeObject.title, animeObject.epsNum, false);
                        } 
                    }
                }
            });
        }
    });
    */
   mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
        client.close();
    }
    else {
        const db = client.db('aniHaruka');
        db.collection('titleCollection').find({ title : title }).toArray((findErr, findRes) => {
            if (findErr) {
                client.close();
            }
            else if (findRes.length != 0) {
                const titleObject = findRes[0];

                // unwrap subs list
                const subsArray = new Array();
                for (const objArr in titleObject.subs) {
                    subsArray.push(titleObject.subs[objArr]);
                }

                for (let i = 0; i < subsArray.length; i++) {
                    if (subsArray[i].retardedMode == true) {
                        lineModules.pushAnimeUpdate(subsArray[i].objectid, animeObject.title, animeObject.epsNum, true);
                    }
                    else {
                        lineModules.pushAnimeUpdate(subsArray[i].objectid, animeObject.title, animeObject.epsNum, false);
                    }
                }
                client.close();
            }
            else {
                client.close();
            }
        });
    }
});

    /* lineModules.pushAnimeUpdate('Rd4502566c5ebf63b596bb45d8d58efd7', animeObject.title, animeObject.epsNum);
    lineModules.pushAnimeUpdate('C7b31e8ebaf44dd12055159d6aebd7bf3', animeObject.title, animeObject.epsNum); */
    // AnimeContainer.length = 0;
};

