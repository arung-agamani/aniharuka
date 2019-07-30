const Post = require('../models/BlogPost');
const quillDelta = require('node-quill-converter');


module.exports = (req, res) => {
    Post.find({ link : req.body.editLink }, (err, posts) => {
        const item = posts[0];
        const quillRaw = quillDelta.convertHtmlToDelta(item.blogContent);
        item.blogContentDelta = JSON.stringify(quillRaw);
        console.log(item._id);
        res.render('editPost', { item });
    });
};