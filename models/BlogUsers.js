const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    dateCreated : {
        type : Date,
        default : new Date(),
    },
});

const User = mongoose.model('blogUser', UserSchema);

module.exports = User;