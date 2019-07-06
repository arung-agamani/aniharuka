const Post = require('../models/BlogPost');

module.exports = async (req, res) => {
    const origUrl = req.originalUrl;
    const postLink = origUrl.slice(6);
    const posts = await Post.find({ link : postLink });
    res.render('layout/individualPost', { posts });
};