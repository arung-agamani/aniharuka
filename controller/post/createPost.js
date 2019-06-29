const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : String,
    description : String,
    content : String,
    dateCreated : {
        type : Date,
        default : new Date(),
    },
    heroImage : String,
})