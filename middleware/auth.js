const User = require('../models/BlogUsers');

module.exports = (req, res, next) => {
    User.findById(req.session.userId, (error, user) => {
        if (error || !user) {
            return res.redirect('/');
        }

        next();
    });
};