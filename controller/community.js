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

    return community
}

const newCommunity = async (CommunityData) => {

    const nCommunity = await Community.create(CommunityData)
    console.log(nCommunity)
    return {
        _id: nCommunity._id
    }
}

const updateCommunity = async (id, CommunityData = {}) => {
    const communityName = CommunityData.communityName
    const avatar = CommunityData.avatar
    const description = CommunityData.description
    const resCommunity = await Community.findOneAndUpdate(
        {_id: id},
        {communityName,avatar,description},
        {new: true}
    )
    if(resCommunity == null) return false
    return resCommunity
}

const delCommunity = async (id) => {
    const resCommunity = await Community.findByIdAndDelete({_id: id})
    if(Community == null) return false
    return resCommunity
}

module.exports = {
    getList,
    getAllList,
    getDetail,
    newCommunity,
    updateCommunity,
    delCommunity
}