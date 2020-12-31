const xss = require('xss')
const Community = require('../db/models/Community')
const Event = require('../db/models/Event')
const getList = async (author, keyword) => {

    // const whereOpt = {}
    // if(cid) whereOpt.cid = cid
    // if(keyword) whereOpt.keyword = new RegExp(keyword) 
    // //RegExp创建正则表达式 实现模糊查询 
    const list = await Community.find({}).sort({_id: 1})
    return list
}

const getAllList = async () => {
    const ComList = await Community.find({}).sort({_id: 1})
    var newComList = []
    for (var value of ComList) {
        let sEnvList = await Event.find({community:value._id}).sort({_id: 1})
        value = JSON.stringify(value)
        value = JSON.parse(value)
        value.events = sEnvList
        newComList.push(value)
    }
    return newComList
}

const getDetail = async (id) => {
    // console.log(id)
    const community = await Community.findById(id)
    // console.log(community)
    //创建时间格式化
    return community
}

const newCommunity = async (CommunityData = {}) => {
    const title = xss(CommunityData.title)
    const content = xss(CommunityData.content)
    const author = CommunityData.author

    const Community = await Community.create({
        title,
        content,
        author
    })

    return {
        id: Community._id
    }
}

const updateCommunity = async (id, CommunityData = {}) => {
    const title = xss(CommunityData.title)
    const content = xss(CommunityData.content)

    const Community = await Community.findOneAndUpdate(
        {_id: id},
        {title,content},
        {new: true}
    )
    if(Community == null) return false
    return true
}

const delCommunity = async (id, author) => {
    const Community = await Community.findByIdAndDelete(
        {_id: id,
        author
        })
    if(Community == null) return false
    return true
}

module.exports = {
    getList,
    getAllList,
    getDetail,
    newCommunity,
    updateCommunity,
    delCommunity
}