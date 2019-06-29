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

// Global Variables
const AnimeContainer = new Array();

// Importing raw data from GetFeed.js
const feedOBJ = require('./GetFeed');

// Object for containing the feeds
let feedItems = new Array();

feedOBJ.GetFeed('http://horriblesubs.info/rss.php?res=720', (error, feeds) => {
    if (!error) {
        feedItems = feeds;
    }
    else {
        console.log('Error message thrown : ');
        console.log(error);
    }
});
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
setTimeout(() => {
    console.log('Currently airing anime :');
    for (let i = 0; i < feedItems.length; i++) {
        const rawString = feedItems[i].title;
        const RegexpObj = XRegExp.exec(rawString, /\[HorribleSubs\]\s(.*)\s-\s(\d+)\s\[720p\]\.mkv/);
        const extractedTitle = RegexpObj[1];
        if (AnimeContainer.includes(extractedTitle) == false) {
            const animeObject = {
                title : extractedTitle,
                epsNum : RegexpObj[2],
                link : feedItems[i].link,
            };
            AnimeContainer.push(animeObject);
        }

        
    }
    // for (let i = 0; i < AnimeContainer.length; i++) {
        // console.log(AnimeContainer[i]);
        // util_Mongo.mongoAddTitleItem(AnimeContainer[i]);
    // }
    // util_Mongo.mongoAddTitleItem(AnimeContainer);
    util_Mongo.mongoAddAnimeItem(AnimeContainer);
    AnimeContainer.length = 0;
}, 3000);

module.exports.regexAnimePush = function(str_title, link) {
    const RegexpObj = XRegExp.exec(str_title, /\[HorribleSubs\]\s(.*)\s-\s(\d+)\s\[720p\]\.mkv/);
    const title = RegexpObj[1];
    const animeObject = {
        title : title,
        epsNum : RegexpObj[2],
        link : link,
    };
    AnimeContainer.push(animeObject);
    util_Mongo.mongoAddAnimeItem(AnimeContainer);
    AnimeContainer.length = 0;
};

