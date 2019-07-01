const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title : String,
    description : String,
    content : String,
});

const PostModel = mongoose.model('Post', PostSchema);

module.exports = (req, res) => {
    // console.log(req.body);
    PostModel.create(req.body, (error, post) => {
        res.render('createPost');
    });
};