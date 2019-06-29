/* eslint-disable indent */
const mongo = require('mongodb').MongoClient;
const lineModules = require('./LINE_Endpoint');

const uri = process.env.MONGO_URL;

const line = require('@line/bot-sdk').Client;

const config = {
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
	channelSecret: process.env.LINE_SECRET,
};

const lineClient = new line(config);

function userFindSubItem(userID, subItem, result) {
    mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
        if (err) {
            // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
            result('Error when connecting to db');
            client.close();
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('lineGroupSetting').insertOne({
                groupid : 'aaaaa',
                retardMode : true,
            }, (insertErr, insertRes) => {
                if (insertErr) {
                    console.log('Error on inserting lineGroupSetting : ', insertErr);
                }
                else {
                    console.log('Success on inserting new doc');
                    console.log('inserted doc id : ', insertRes.insertedId);
                }
            });
        }
    });
}

function queryGroup() {
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
                    console.log('Found retarded group list : ', findRes.length);

                    for (let i = 0; i < findRes.length; i++) {
                        const groupID = findRes[i].groupid;
                        console.log(groupID);
                    }
                }
                client.close();
            });

            db.collection('lineGroupSetting').find({ retardMode : false }).toArray((findErr, findRes) => {
                if (findErr) {
                    console.log('Error on pulling lineGroupSetting data : ', findErr);
                }
                else if (findRes.length != 0) {
                    console.log('Found civilized group list : ', findRes.length);
                    for (let i = 0; i < findRes.length; i++) {
                        const groupID = findRes[i].groupid;
                        console.log(groupID);
                        console.log(groupID.length);
                    }
                }
                client.close();
            });
        }
    });
}

function alterItem(groupID) {
    mongo.connect(uri, { useNewUrlParser: true }, (connectErr, client) => {
        if (connectErr) {
            console.log('Error on connecting to Atlas db');
        }
        else {
            const db = client.db('aniHaruka');
            db.collection('lineGroupSetting').find({ groupid : groupID }).toArray((findErr, findRes) => {
                if (findErr) {
                    console.log('Error on pulling lineGroupSetting data : ', findErr);
                }
                else if (findRes.length != 0) {
                    console.log('Found group list : ', findRes.length);

                    if (findRes[0].retardMode == true) {
                        db.collection('lineGroupSetting').updateOne({ groupid : groupID }, { $set: { retardMode: false } });
                        console.log('Altered one item to false');
                    }
                    else {
                        db.collection('lineGroupSetting').updateOne({ groupid : groupID }, { $set: { retardMode: true } });
                        console.log('Altered one item to true');
                    }
                }
                client.close();
            });
        }
    });
}

function addSubs(title, objectId, isRetard, result) {
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
                                }
                                else {
                                    console.log('Subscriber list updated with modified count : ', updateRes.matchedCount);
                                }
                            });
                        }
                        result('success', 'Title has subscribers!');
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
                            }
                            else {
                                console.log('Subscriber list updated with modified count : ', updateRes.matchedCount);
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
}

function delSubs(title, objectId, isRetard, result) {
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
                                }
                                else {
                                    console.log('Subscriber list updated with modified count : ', updateRes.matchedCount);
                                }
                            });

                        result('success', 'Title has subscribers!');
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
}

function pullSubs(title, result) {
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
}

// alterItem('aaaaa');
// delSubs('Bonobono', 'ddd', 'ccc', result => {console.log(result);});
// pullSubs('Bonobono', result => {console.log(result);});
/*
mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        // console.log('Error occured while connecting to MongoDB Atlas... \n', err);
        client.close();
    }
    else {
        const db = client.db('aniHaruka');
        db.collection('titleCollection').find({ title : 'Tensei Shitara Slime Datta Ken' }).toArray((findErr, findRes) => {
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
                        lineModules.pushAnimeUpdate(subsArray[i].objectid, 'Tensei Shitara Slime Datta Ken', -20, true);
                    }
                    else {
                        lineModules.pushAnimeUpdate(subsArray[i].objectid, 'Tensei Shitara Slime Datta Ken', -20, false);
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
*/
const jsonMessage = {
    type : 'text',
    text : 'A-Awoo!!! >///<\nA-anone! I have a new feature that just been injected inside me very roughly from master.\nI-it\'s not a big deal, I love every process of it, hehe\nHere, I can tell you if something you like just released!\nBut before that, you need to tell me your small little secret, ehehe~\n\nIf you want to talk it in secret, then lets get into my room and speak from heart-to-heart about your little secret.\nBut you need to tell me in a veeeery specific way.\nJust start with "!sub" then follow it with your naughty little secret, fufu~\nIf I happen to know something about that, I\'ll let you know about it more, hehe~\nIf I don\'t, then maybe me in another dimension would know it.\nRemember, I don\'t know everything, I just know what I know.\n\nAra? You want to tell everyone about your secret?\nYou exhibitionist, but I like it, kyun~~\nYou can also do the same in your group or room.\n\nNext things gonna be demonstrated by my master.\nGanbatte ne! Mastah~'
};

lineClient.pushMessage('C7b31e8ebaf44dd12055159d6aebd7bf3', jsonMessage);