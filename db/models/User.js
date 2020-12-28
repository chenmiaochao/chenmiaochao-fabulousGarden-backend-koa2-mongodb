//user collection
const mongoose = require('../db')

//Schema定义数据规范
const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {type: String, require: true, select: false},
    name : String
}, {timestamps:true})

//Model ->collection
//单数复数都可以,数据库自动变成复数
const User = mongoose.model('user', UserSchema)

module.exports = User