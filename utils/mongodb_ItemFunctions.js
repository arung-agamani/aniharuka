/* eslint-disable no-unused-vars */
/* eslint-disable no-lonely-if */
/* eslint-disable indent */
const mongo = require('mongodb').MongoClient;
const uri = process.env.MONGO_URL;
/**
 * @param {Array} array_title
 */

Object.prototype.hasOwnProperty = function(property) {
	return typeof this[property] !== 'undefined';
};

module.exports.mongoAddTitleItem = function(array_title) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('Error on connecting to Atlas at mongo.connect callback :', err);
        }
        else {
            const titleCollection = client.db('aniHaruka').collection('titleCollection');
            const dbArray = new Array();
            const toInsertArray = new Array();
            titleCollection.find().toArray((err, result) => {
                if (err) { throw err; }
                else {
                    for (const obj in result) {
                        dbArray.push(result[obj].title);
                    }
                    for (let i = 0; i < array_title.length; i++) {
                        const titleObject = {
                            title: array_title[i],
                        };
                        if (dbArray.includes(array_title[i]) == false) {

                            console.log(titleObject);
                            toInsertArray.push(titleObject);
                        }
                        else {
                            console.log(titleObject.title + ' was found in dbArray');
                        }
                    }
                    if (toInsertArray.length !== 0) {
                        titleCollection.insertMany(toInsertArray);
                        console.log('Insert Data completed');
                    }
                    client.close();
                }
            });
        }
        }
    );
};

/**
 * @param {String} title
 * @param {Number} epsNumber
 * @param {String} epsLink
 */

module.exports.mongoAddEpisodeItem = function(title, epsNumber, epsLink) {
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        if (connectErr) {
            console.log('Error on connecting to mongo at mongoAddEpisodeItem function : ', connectErr);
        }
        else {
            const titleCollection = client.db('aniHaruka').collection('titleCollection');
            const episodeArray = new Array();
            const episodeObj = {
                epNum: epsNumber,
                link: epsLink,
            };
            titleCollection.find({ title: title }).toArray((unwrapErr, unwrapRes) => {
                for (const objArr in unwrapRes[0].episodes) {
                    episodeArray.push(unwrapRes[0].episodes[objArr]);
                }
                console.log(episodeArray);
            });

            // make another episode array then repeat the same process. Efficient?

            // check if episode exists
            titleCollection.find({ episodes: { epNum: epsNumber, link: epsLink } }).toArray((findErr, findRes) =>{
                if (findRes.length == 0) {
                    console.log('Ep is not found. Commencing upsert.');

                    episodeArray.push(episodeObj);
                    titleCollection.updateOne({ title: title }, {
                        $set : { episodes : episodeArray },
                    }, { upsert: true }, (updateErr, updateRes) => {
                        if (updateErr) {
                            console.log('Error on updating one item at addEpisodeItem function : ', updateErr);
                            client.close();
                        }
                        else {
                            console.log('Successfully updated one item');
                            console.log('Path : ' + title + ' -> episode : ' + epsNumber);
                            client.close();
                        }
                    });
                }
                else {
                    console.log('Ep found. Nothing to do');
                    client.close();
                }
            });


        }
    });
};

module.exports.mongoDeleteEpisodeItem = function(title, epsNumber) {
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        if (connectErr) {
            console.log('Error on connecting to mongo at mongoAddEpisodeItem function : ', connectErr);
        }
        else {
            const titleCollection = client.db('aniHaruka').collection('titleCollection');

            titleCollection.deleteOne({ title: title }, (deleteErr, deleteRes) => {
                if (deleteErr) {
                    console.log('Error on updating one item at addEpisodeItem function : ', deleteErr);
                    client.close();
                }
                else {
                    console.log('Successfully deleted one item');
                    client.close();
                }
            });
        }
    });
};

/**
 * @param {String} title
 */
module.exports.mongoReadTitle = function(title) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('Error occured while connecting to MongoDB Atlas... \n', err);
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('titleCollection').find({ title: title }).toArray((err, result) => {
                if (err) { throw err; }
                else {
                console.log(result[0]);

                for (const objArr in result[0].episodes) {
                    console.log(result[0].episodes[objArr]);
                }
                client.close();
            }
            });
        }
    });
};

/**
 * @typedef {Object[]} AnimeObjectTypedef
 * @property {String} AnimeObjectTypedef[].title
 * @property {Number} AnimeObjectTypedef[].epsNum
 * @property {String} AnimeObjectTypedef[].link
 *
 * @param {AnimeObjectTypedef} animeObject
 */

module.exports.mongoAddAnimeItem = function(animeObject) {
    // check if title exists
    // if not : add title and then add episodes
    // if yes : add episodes instead
    const AnimeObject = animeObject;
    console.log('mongoAddAnimeItem method has been called');
    // console.log(AnimeObject);
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        console.log('Connected to mongoDB');
        const titleCollection = client.db('aniHaruka').collection('titleCollection');
        // console.log(AnimeObject);
        let itemWithEpsCount = 0;
        let itemWithoutEpsCount = 0;

        // foreach check on animeobject
        for (const animObj in AnimeObject) {
            console.log('animObj for in AnimeObject loop called');
            const animTitle = AnimeObject[animObj].title;
            const animEpsNum = AnimeObject[animObj].epsNum;
            const animLink = AnimeObject[animObj].link;
            titleCollection.find({ title : animTitle }).toArray((foreachErr, foreachResult) =>{
                if (foreachResult.length !== 0) {
                    const episodeArray = new Array();
                    const episodeObj = {
                        epNum: animEpsNum,
                        link: animLink,
                    };
                    // console.log('foreachResult : ', foreachResult);
                    const unwrapRes = foreachResult;
                    // console.log('Unwrap res : ', unwrapRes[0]);
                    for (const objArr in unwrapRes[0].episodes) {
                        episodeArray.push(unwrapRes[0].episodes[objArr]);
                    }
                    // console.log(episodeObj);
                    // console.log(unwrapRes[0].episodes);

                    if (foreachResult[0].hasOwnProperty('episodes')) {
                        if (foreachResult[0].episodes.length > 0) {
                            console.log(foreachResult[0].title + ' has ' + foreachResult[0].episodes.length + ' episodes.');
                            itemWithEpsCount++;
                            // console.log(foreachResult[0].episodes[0]);
                            this.mongoAddEpisodeItem(animTitle, animEpsNum, animLink);
                        }
                    }
                    else {
                        console.log(foreachResult[0].title + ' has no episodes.');
                        itemWithoutEpsCount++;

                        // check if AnimeContainer has the item
                        if (AnimeObject[animObj].epNum !== null && AnimeObject[animObj].link !== null) {
                            console.log('======Item available for inserting=======');
                            this.mongoAddEpisodeItem(animTitle, animEpsNum, animLink);
                        }
                        // add episodes

                    }
                }
                else {
                    // add title and items
                    titleCollection.insertOne({ title: animTitle, episodes: [ { epNum: animEpsNum, link: animLink } ] }, (insertErr, insertRes) => {
                        if (insertErr) {
                            console.log('Error on inserting title and episode to newly-found title :', insertErr);
                        }
                        else {
                            console.log('Successfully added newly-found title and episodes');
                        }
                    });
                }
                console.log('Titles with episodes : ', itemWithEpsCount);
                console.log('Titles without episodes : ', itemWithoutEpsCount);
                console.log('Total items : ' + (itemWithEpsCount + itemWithoutEpsCount));
            });

        }


        client.close();
    });
};

module.exports.mongoSearchEpisodeItem = function(title, episode, callback) {
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        const titleCollection = client.db('aniHaruka').collection('titleCollection');

        // search for string in documents
        console.log('Search title : ', title);
        console.log('Episode : ', episode);
        titleCollection.find({
            title : {
                $regex: title,
            },
        })
        .toArray((searchErr, searchRes) => {

            if (searchRes.length != 0) {
                const foundTitle = searchRes[0];
                // search for episode
                // console.log(foundTitle);
                console.log('Title found!');
                let posted = false;
                for (const episodeObj in foundTitle.episodes) {
                    const epObjNum = foundTitle.episodes[episodeObj].epNum;
                    if (epObjNum == episode && posted == false) {
                        posted = true;
                        console.log('Episode found!');
                        console.log('Returning episode link....');
                        callback(foundTitle.episodes[episodeObj].link);
                        console.log('=========== End of session =============');
                        break;
                    }
                    // console.log('posted : ', posted);
                }
                if (posted == false) {
                    console.log('Episode not found');
                    console.log('=========== End of session =============');
                    callback('Episode not found');
                    client.close();
                }
        }
        });
    });
};

module.exports.mongoSearchForTitleToSub = function(title, objectId, callback) {
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        const titleCollection = client.db('aniHaruka').collection('titleCollection');

        // search for string in documents
        console.log('Search title : ', title);
        const processedTitle = title.split(/\s/);
        const newTitleWithWhitespace = processedTitle.join('.*');
        const titleRegexp = new RegExp('.*' + newTitleWithWhitespace + '.*', 'i');
        console.log(titleRegexp);
        titleCollection.find({
            title : {
                $regex: titleRegexp,
            },
        })
        .toArray((searchErr, searchRes) => {
            if (searchRes.length != 0) {
                const foundTitle = searchRes[0];
                // search for episode
                // console.log(foundTitle);
                console.log('Title found!');
                console.log(foundTitle.title);
                this.mongoAddSubs(foundTitle.title, objectId, false, (resStatus, resMessage) => {
                    if (resStatus == 'error' || resStatus == 'failed') {
                        callback(resMessage);
                        client.close();
                    }
                    else if (resStatus == 'success') {
                        callback(resMessage);
                        client.close();
                    }
                });
            }
            else {
                console.log('Title not found!');
                callback('Title not found!');
                client.close();
            }
        });
    });
};

module.exports.mongoSearchForTitleToUnsub = function(title, objectId, callback) {
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        const titleCollection = client.db('aniHaruka').collection('titleCollection');

        // search for string in documents
        console.log('Search title : ', title);
        const processedTitle = title.split(/\s/);
        const newTitleWithWhitespace = processedTitle.join('.*');
        const titleRegexp = new RegExp('.*' + newTitleWithWhitespace + '.*', 'i');
        titleCollection.find({
            title : {
                $regex: titleRegexp,
            },
        })
        .toArray((searchErr, searchRes) => {

            if (searchRes.length != 0) {
                const foundTitle = searchRes[0];
                // search for episode
                // console.log(foundTitle);
                console.log('Title found!');
                this.mongoDelSubs(foundTitle.title, objectId, false, (resStatus, resMessage) => {
                    if (resStatus == 'error' || resStatus == 'failed') {
                        callback(resMessage);
                        client.close();
                    }
                    else if (resStatus == 'success') {
                        callback(resMessage);
                        client.close();
                    }
                });
            }
            else {
                console.log('Title not found!');
                callback('Title not found!');
                client.close();
            }
        });
    });
};

module.exports.mongoInsertUserItem = function(userID, subscribedItem, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('Error occured while connecting to MongoDB Atlas...');
        }
        else {
            const db = client.db('aniHaruka');
            const userObject = {
                userid: userID,
                subscribedItems: [
                    subscribedItem,
                ],
            };
            db.collection('userCollection').find({ userid : userID }).toArray((findErr, findRes) => {
                if (findErr) {
                    console.log('Error on find : ', findErr);
                    result('Error on find function');
                }
                else if (findRes.length != 0 && findRes[0].subscribedItems.indexOf(subscribedItem) != -1) {
                        console.log('Item exists');
                        result('Item already subscribed');
                        client.close();
                    }
                    else if (findRes.length == 0) {
                            db.collection('userCollection').insertOne(userObject, (insertErr, insertRes) => {
                                if (insertErr) {
                                    console.log('Error on making new collection : ', insertErr);
                                    result('Error on making new collection');
                                    client.close();
                                }
                                else {
                                    console.log('Success on inserting new collection');
                                    result('Success on inserting new collection and document');
                                    console.log('new item ID : ', insertRes.insertedId);
                                    client.close();
                                }
                            });
                        }
                    else {
                        const subsArray = findRes[0].subscribedItems;
                        subsArray.push(subscribedItem);
                        db.collection('userCollection').updateOne({ userid : userID }, { $set: { subscribedItems: subsArray } });
                        console.log('Document updated');
                        result('Added item to your subscribed list');
                        client.close();
                    }
            });
        }
    });
};

module.exports.mongoUserSubsList = function userFindSubItem(userID, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('userCollection').find({ userid : userID }).toArray((findErr, findRes) => {
                if (findErr) {
                    // console.log('Error on finding userid : ', findErr);
                    result('Error on finding userid');
                    client.close();
                }
                else {
                    // console.log(findRes);
                    result(findRes[0].subscribedItems);
                    client.close();
                }
            });
        }
    });
};

module.exports.mongoGroupPrefs = function(groupID, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('error', 'Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('lineGroupSetting').find({ groupid : groupID }).toArray((findErr, findRes) => {
                if (findErr) {
                    // console.log('Error on finding userid : ', findErr);
                    result('error', 'Error on finding groupid');
                    client.close();
                }
                else if (findRes.length != 0) {
                    result('success', findRes[0]);
                    client.close();
                }
                else {
                    result('failed', 'GroupID isn\'t found.\nUse "!addGroup" command to.... it\'s self-explanatory... b-baka');
                    client.close();
                }
            });
        }
    });
};

module.exports.mongoAddGroup = function(groupID, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');

            db.collection('lineGroupSetting').find({ groupid : groupID }).toArray((findErr, findRes) => {
                if (findErr) {
                    console.log('Error on find : ', findErr);
                    result('Error on find function');
                }
                else if (findRes.length != 0) {
                        console.log('Already registered');
                        result('Group already registered.\nB-baka...');
                        client.close();
                }
                else {
                    db.collection('lineGroupSetting').insertOne({
                        groupid : groupID,
                        retardMode : true,
                    }, (insertErr, insertRes) => {
                        if (insertErr) {
                            console.log('Error on inserting lineGroupSetting : ', insertErr);
                            result('Error on inserting lineGroupSetting');
                            client.close();
                        }
                        else {
                            console.log('Success on inserting new doc');
                            console.log('inserted doc id : ', insertRes.insertedId);
                            result('Success on inserting new doc. \nInserted doc id : ' + insertRes.insertedId);
                            client.close();
                        }
                    });
                }
            });
        }
    });
};

module.exports.mongoGroupRetardPref = function(groupID, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        if (connectErr) {
            console.log('Error on connecting to Atlas db');
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('lineGroupSetting').find({ groupid : groupID }).toArray((findErr, findRes) => {
                if (findErr) {
                    console.log('Error on pulling lineGroupSetting data : ', findErr);
                    client.close();
                }
                else if (findRes.length != 0) {
                    console.log('Found group list : ', findRes.length);

                    if (findRes[0].retardMode == true) {
                        db.collection('lineGroupSetting').updateOne({ groupid : groupID }, { $set: { retardMode: false } });
                        console.log('Altered one item to false');
                        result('Altered one item to false');
                        client.close();
                    }
                    else {
                        db.collection('lineGroupSetting').updateOne({ groupid : groupID }, { $set: { retardMode: true } });
                        console.log('Altered one item to true');
                        result('Altered one item to true');
                        client.close();
                    }
                }
                else {
                    console.log('Group is not found in database');
                    result('Group is not found in database');
                    client.close();
                }
            });
        }
    });
};

module.exports.mongoAddSubToTitle = function(title, objectId, isRetard, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('error', 'Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('titleCollection').find({ title : title }).toArray((findErr, findRes) => {
                if (findErr) {
                    result('error', 'Error on finding groupid');
                    client.close();
                }
                else if (findRes.length != 0) {
                    const titleObject = findRes[0];
                    if (titleObject.hasOwnProperty('subs')) {
                        console.log('Title has subscribers!');
                        result('success', 'Title has subscribers!');
                    }
                    else {
                        console.log('Title doesn\'t have subscribers!');
                        result('success', 'Title doesn\'t have subscribers!');
                    }
                    client.close();
                }
                else {
                    result('failed', 'Title is not found. Baka');
                    client.close();
                }
            });
        }
    });
};

module.exports.mongoAddSubs = function(title, objectId, isRetard, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('error', 'Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('titleCollection').find({ title : title }).toArray((findErr, findRes) => {
                const userObj = {
                    'objectid' : objectId,
                    'retardedMode' : isRetard,
                };
                if (findErr) {
                    result('error', 'Error on finding <LINE>objectId');
                    client.close();
                }
                else if (findRes.length != 0) {
                    const titleObject = findRes[0];

                    // unwrap subs list
                    const subsArray = new Array();
                    for (const objArr in titleObject.subs) {
                        subsArray.push(titleObject.subs[objArr]);
                    }
                    // check if exist
                    let isExist = false;
                    let isMatchRetard = false;
                    let index;
                    for (let i = 0; i < subsArray.length; i++) {
                        if (subsArray[i].objectid == objectId) {
                            isExist = true;
                            index = i;
                            if (subsArray[i].retardedMode == isRetard) {
                                isMatchRetard = true;
                            }
                        }
                    }

                    console.log(isMatchRetard);

                    if (titleObject.hasOwnProperty('subs') && isExist) {
                        console.log('Title has subscribers and after checking, the parameter exists!');
                        if (!isMatchRetard) {
                            console.log('isMatchRetard is false');
                            subsArray.splice(index, 1);
                            subsArray.push(userObj);
                            console.log(subsArray);
                            db.collection('titleCollection').updateOne({ title : title }, {
                                $set : {
                                    subs : subsArray,
                                },
                            }, { upsert : true }, (updateErr, updateRes) => {
                                if (updateErr) {
                                    console.log('Error on updating sub list : ', updateErr);
                                    result('error', 'Error on updating sub list.');
                                }
                                else {
                                    console.log('Subscriber list updated with modified count : ', updateRes.matchedCount);
                                    result('success', 'Success! Subscribed to : ' + title);
                                }
                            });
                        }
                    }
                    else {
                        subsArray.push(userObj);
                        console.log(subsArray);
                        console.log('Title doesn\'t have subscribers!');
                        db.collection('titleCollection').updateOne({ title : title }, {
                            $set : {
                                subs : subsArray,
                            },
                        }, { upsert : true }, (updateErr, updateRes) => {
                            if (updateErr) {
                                console.log('Error on updating sub list : ', updateErr);
                                result('error', 'Error on updating sub list');
                            }
                            else {
                                console.log('Subscriber list updated with modified count : ', updateRes.matchedCount);
                                result('success', 'Success! Subscribed to : ' + title);
                            }
                        });
                    }
                    client.close();
                }
                else {
                    result('failed', 'Title is not found. Baka');
                    client.close();
                }
            });
        }
    });
};

module.exports.mongoDelSubs = function(title, objectId, isRetard, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('error', 'Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('titleCollection').find({ title : title }).toArray((findErr, findRes) => {
                const userObj = {
                    'objectid' : objectId,
                    'retardedMode' : isRetard,
                };
                if (findErr) {
                    result('error', 'Error on finding groupid');
                    client.close();
                }
                else if (findRes.length != 0) {
                    const titleObject = findRes[0];

                    // unwrap subs list
                    const subsArray = new Array();
                    for (const objArr in titleObject.subs) {
                        subsArray.push(titleObject.subs[objArr]);
                    }
                    // check if exist
                    let isExist = false;
                    let isMatchRetard = false;
                    let index;
                    for (let i = 0; i < subsArray.length; i++) {
                        if (subsArray[i].objectid == objectId) {
                            isExist = true;
                            index = i;
                            if (subsArray[i].retardedMode == isRetard) {
                                isMatchRetard = true;
                            }
                        }
                    }

                    console.log(isMatchRetard);

                    if (titleObject.hasOwnProperty('subs') && isExist) {
                        console.log('Title has subscribers and after checking, the parameter exists!');

                            console.log('isMatchRetard is false');
                            subsArray.splice(index, 1);
                            console.log(subsArray);
                            db.collection('titleCollection').updateOne({ title : title }, {
                                $set : {
                                    subs : subsArray,
                                },
                            }, { upsert : true }, (updateErr, updateRes) => {
                                if (updateErr) {
                                    console.log('Error on updating sub list : ', updateErr);
                                    result('error', 'Error on deleting sub list');
                                }
                                else {
                                    console.log('Subscriber list updated with modified count : ', updateRes.matchedCount);
                                    result('success', 'Success! Unsubbed from : ' + title);
                                }
                            });
                    }
                    else {
                        console.log('objectid is not found');
                    }
                    client.close();
                }
                else {
                    result('failed', 'Title is not found. Baka');
                    client.close();
                }
            });
        }
    });
};

module.exports.mongoPullSubs = function(title, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('error', 'Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('titleCollection').find({ title : title }).toArray((findErr, findRes) => {
                if (findErr) {
                    result('error', 'Error on finding groupid');
                    client.close();
                }
                else if (findRes.length != 0) {
                    const titleObject = findRes[0];

                    // unwrap subs list
                    const subsArray = new Array();
                    for (const objArr in titleObject.subs) {
                        subsArray.push(titleObject.subs[objArr]);
                    }
                    result(subsArray);
                    client.close();
                }
                else {
                    result('failed', 'Title is not found. Baka');
                    client.close();
                }
            });
        }
    });
};