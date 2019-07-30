const User = require('../../models/BlogUsers');
const bcrypt = require('bcrypt');

module.exports = (req, res) => {
    bcrypt.hash(req.body.password, 15, (err, encrypted) => {
        if (err) {
            console.log(err);
            return res.redirect('/register');
        }
        req.body.password = encrypted;
        User.create(req.body, (error, user) => {
                if (error) {
                    console.log(error);
                    return res.redirect('/register');
                }
                res.redirect('/');
            });
    });
};