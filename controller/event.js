const xss = require('xss')
const Event = require('../db/models/Event')
const xml2js = require('xml2js')
const getList = async (author, keyword) => {

    // const whereOpt = {}
    // if(cid) whereOpt.cid = cid
    // if(keyword) whereOpt.keyword = new RegExp(keyword) 
    // //RegExp创建正则表达式 实现模糊查询 
    const list = await Event.find({}).sort({_id: 1})
    return list
}

const getDetail = async (id) => {
    // console.log(id)
    const event = await Event.findById(id)
    // console.log(event)
    //创建时间格式化
    return event
}

const newEvent = async (EventData) => {
    const newEvent = await Event.create(EventData)

    return {
        community: newEvent.community,
        _id: newEvent._id
    }
}

const updateEvent = async (id, EventData = {}) => {
    const eventName = EventData.eventName
    const date = EventData.date
    const place = EventData.place
    const avatar = EventData.avatar
    const price = EventData.price
    const description = EventData.description
    const community = EventData.community

    const resEvent = await Event.findOneAndUpdate(
        {_id: id},
        {eventName,date,place,avatar,price,description,community},
        {new: true}
    )
    console.log(resEvent)
    if(Event == null) return false
    return resEvent
}

const delEvent = async (id, author) => {
    const Event = await Event.findByIdAndDelete(
        {_id: id,
        author
        })
    if(Event == null) return false
    return true
}
const Xml2Json = async (xmlData) => {
    // console.log(xmlData)
    xmlParser = new xml2js.Parser()
    xmlParser.parseString(xmlData, function (err,result) {
        // console.dir(result)
        var data = result.Results.Hotel
        // console.log(data)
        // console.log('Done');
        // resolve(data)
        return data
    })
}
module.exports = {
    getList,
    getDetail,
    newEvent,
    updateEvent,
    delEvent,
    Xml2Json
}