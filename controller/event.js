const xss = require('xss')
const Event = require('../db/models/Event')

const getList = async (author, keyword) => {

    // const whereOpt = {}
    // if(cid) whereOpt.cid = cid
    // if(keyword) whereOpt.keyword = new RegExp(keyword) 
    // //RegExp创建正则表达式 实现模糊查询 
    const list = await Event.find({}).sort({_id: -1})
    return list
}

const getDetail = async (id) => {
    // console.log(id)
    const event = await Event.findById(id)
    // console.log(event)
    //创建时间格式化
    return event
}

const newEvent = async (EventData = {}) => {
    const title = xss(EventData.title)
    const content = xss(EventData.content)
    const author = EventData.author

    const Event = await Event.create({
        title,
        content,
        author
    })

    return {
        id: Event._id
    }
}

const updateEvent = async (id, EventData = {}) => {
    const title = xss(EventData.title)
    const content = xss(EventData.content)

    const Event = await Event.findOneAndUpdate(
        {_id: id},
        {title,content},
        {new: true}
    )
    if(Event == null) return false
    return true
}

const delEvent = async (id, author) => {
    const Event = await Event.findByIdAndDelete(
        {_id: id,
        author
        })
    if(Event == null) return false
    return true
}

module.exports = {
    getList,
    getDetail,
    newEvent,
    updateEvent,
    delEvent
}