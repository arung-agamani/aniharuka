const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : String,
    datePosted : {
        type : Date,
        default : new Date(),
    },
    author : String,
    description : String,
    blogContent : String,
    link : String,
    blogContentDelta : Object,
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;