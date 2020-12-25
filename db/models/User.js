//user collection
const mongoose = require('../db')

//Schema定义数据规范
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: String,
    realname : String
}, {timestamps:true})

//Model ->collection
//单数复数都可以,数据库自动变成复数
const User = mongoose.model('user', UserSchema)

module.exports = User