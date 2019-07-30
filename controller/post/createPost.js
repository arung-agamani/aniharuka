const PostModel = require('../../models/BlogPost');
module.exports = (req, res) => {
    req.body.link = req.body.title.toLowerCase().split(' ').join('-');
    req.body.blogContentDelta = JSON.parse(req.body.blogContentDelta);
    PostModel.create(req.body, (error, post) => {
        res.render('createPost');
    });
};