//post collection
const mongoose = require('../db')

//Schema定义数据规范
const PostSchema = mongoose.Schema({
    // Id: number;
    author: String,
    title: {
        type: String,
        require: true,
    },
    content: String,
    image: String,
    createdAt: String,
    createdAtMonth: String,
    community: String,
    event: String
}, {timestamps:true})

//Model ->collection
//单数复数都可以,数据库自动变成复数
const Post = mongoose.model('post', PostSchema)

module.exports = Post