const PostModel = require('../../models/BlogPost');
module.exports = (req, res) => {
    // console.log(req.body);
    PostModel.create(req.body, (error, post) => {
        res.render('createPost');
    });
};