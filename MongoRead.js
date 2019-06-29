/* eslint-disable indent */
const mongo = require('mongodb').MongoClient;

const uri = process.env.MONGO_URL;

mongo.connect(uri, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.log('Error occured while connecting to MongoDB Atlas... \n', err);
    }
    else {
        const db = client.db('aniHaruka');
        db.collection('titleCollection').find({ title : 'Black Clover' }).toArray((findErr, findRes) => {
            if (findErr) {
                console.log('Error on find : ', findErr);
            }
            else {
                console.log(findRes[0]);
                client.close();
            }
        });
    }
});