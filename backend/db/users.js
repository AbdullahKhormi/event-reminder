const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
    userName: {type:String,requerd:true},
    email: {type:String,requerd:true},
    password:{type:String,requerd:true}
});

const Users = mongoose.model('users', usersSchema);

module.exports = Users;
