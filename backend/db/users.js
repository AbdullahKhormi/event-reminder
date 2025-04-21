const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const usersSchema = mongoose.Schema({
    userId: { type: Number },
    userName: { type: String, required: true },
    roles:  {type:String,default:"user"},
    email: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: null });

usersSchema.plugin(AutoIncrement, { inc_field: 'userId' });

const Users = mongoose.model('users', usersSchema);

module.exports = Users;
