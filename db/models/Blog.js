//blog collection

const mongoose = require('../db')

//Schema定义数据规范
const BlogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true, //必須
    },
    content: String,
    author: {
        type:String,
        required:true
    }
}, {timestamps:true})

//Model ->collection
const Blog = mongoose.model('blog', BlogSchema)//单数复数都可以,数据库自动变成复数

module.exports = Blog