const xss = require('xss')
const Post = require('../db/models/Post')

const getList = async (author, keyword) => {

    // const whereOpt = {}
    // if(cid) whereOpt.cid = cid
    // if(keyword) whereOpt.keyword = new RegExp(keyword) 
    // //RegExp创建正则表达式 实现模糊查询 
    const list = await Post.find({}).sort({_id: -1})
    return list
}

const getDetail = async (id) => {
    // console.log(id)
    const post = await Post.findById(id)
    // console.log(post)
    //创建时间格式化
    return post
}

const newPost = async (PostData = {}) => {
    const title = xss(PostData.title)
    const content = xss(PostData.content)
    const author = PostData.author

    const Post = await Post.create({
        title,
        content,
        author
    })

    return {
        id: Post._id
    }
}

const updatePost = async (id, PostData = {}) => {
    const title = xss(PostData.title)
    const content = xss(PostData.content)

    const Post = await Post.findOneAndUpdate(
        {_id: id},
        {title,content},
        {new: true}
    )
    if(Post == null) return false
    return true
}

const delPost = async (id, author) => {
    const Post = await Post.findByIdAndDelete(
        {_id: id,
        author
        })
    if(Post == null) return false
    return true
}

module.exports = {
    getList,
    getDetail,
    newPost,
    updatePost,
    delPost
}