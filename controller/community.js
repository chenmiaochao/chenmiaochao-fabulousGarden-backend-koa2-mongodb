const xss = require('xss')
const Community = require('../db/models/Community')

const getList = async (author, keyword) => {

    // const whereOpt = {}
    // if(author) whereOpt.author = author
    // if(keyword) whereOpt.keyword = new RegExp(keyword) 
    // //RegExp创建正则表达式 实现模糊查询 
    const list = await Community.find({}).sort({_id: -1})
    return list
}

const getDetail = async (id) => {

    const Community = await Community.findById(id)
    //创建时间格式化
    return Community
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
    getDetail,
    newCommunity,
    updateCommunity,
    delCommunity
}