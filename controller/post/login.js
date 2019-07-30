const User = require('../../models/BlogUsers');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username : username }, (err, user) => {
        if (user) {
            bcrypt.compare(password, user.password, (err, isEqual) => {
                if (isEqual) {
                    req.session.userId = user._id;
                    res.redirect('/');
                }
                else {
                    res.redirect('/login');
                }
            });
        }
        else {
            res.redirect('/login');
        }
    });
};