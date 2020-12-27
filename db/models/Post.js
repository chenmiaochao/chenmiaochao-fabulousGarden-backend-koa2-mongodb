//post collection
const mongoose = require('../db')

//Schema定义数据规范
const PostSchema = mongoose.Schema({
    // Id: number;
    title: {
        type: String,
        require: true,
    },
    image: String,
    createdAt: String,
    community: String,
    event: String
}, {timestamps:true})

//Model ->collection
//单数复数都可以,数据库自动变成复数
const Post = mongoose.model('post', PostSchema)

module.exports = Post