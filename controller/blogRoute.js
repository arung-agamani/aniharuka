const Post = require('../models/BlogPost');
const url = require('url');

module.exports = async (req, res) => {
    const origUrl = url.parse(req.originalUrl).pathname;
    const postLink = origUrl.slice(6);
    const posts = await Post.find({ link : postLink });
    let logged = false;
    if (req.session.userId) {
        logged = true;
    }
    res.render('layout/individualPost', { posts, logged });
};