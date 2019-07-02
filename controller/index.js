const Post = require('../models/BlogPost');

module.exports = async (req, res) => {
    const posts = await Post.find({});
    res.render('layout/index', { posts });
};