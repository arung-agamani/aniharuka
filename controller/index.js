const Post = require('../models/BlogPost');

module.exports = async (req, res) => {
    const posts = await Post.find({}).sort('-datePosted');
    let logged = false;
    if (req.session.userId) {
        logged = true;
    }
    res.render('layout/index', { posts, logged });
};