const Post = require('../../models/BlogPost');

module.exports = (req, res) => {
    req.body.link = req.body.title.toLowerCase().split(' ').join('-');
    Post.findByIdAndUpdate(req.body.blogPostId, req.body, (err, upt) => {
        if (err) { console.log('Error happened : ', err); res.send('Error!'); }
        else { res.send('DONE!'); }
    });
};