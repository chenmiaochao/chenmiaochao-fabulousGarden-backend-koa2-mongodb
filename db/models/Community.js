//community collection
const mongoose = require('../db')

//Schema定义数据规范
const CommunitySchema = mongoose.Schema({
    // Id: number;
    title: {
        type: String,
        require: true,
    },
    description: String
}, {timestamps:true})

//Model ->collection
//单数复数都可以,数据库自动变成复数
const Community = mongoose.model('community', CommunitySchema)

module.exports = Community