//event collection
const mongoose = require('../db')

//Schema定义数据规范
const EventSchema = mongoose.Schema({
    // Id: number;
    eventName: {
        type: String,
        require: true,
    },
    author: String,
    date: String,
    place: String,
    avatar: String,
    price: String,
    description: String,
    community: String
}, {timestamps:true})

//Model ->collection
//单数复数都可以,数据库自动变成复数
const Event = mongoose.model('event', EventSchema)

module.exports = Event