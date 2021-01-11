const xss = require('xss')
const Post = require('../db/models/Post')
const Community = require('../db/models/Community')
const tcb = require('@cloudbase/node-sdk')
const tcbKey = require('../cloudbaserc1.json')
const fs = require("fs");
const { resolve } = require('path');
// const { resolve } = require('dns');
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

const upload = async (body) => {
    let cloudFileName = "uploads/"+body.photo.name
    const tcbApp = tcb.init(tcbKey)
    // tcbの戻り値は全部promise 
    await tcbApp.uploadFile({
        // 云存储的路径
        cloudPath: cloudFileName,
        // 需要上传的文件，File 类型
        fileContent: fs.createReadStream(`${body.photo.path}`)
        })
        .then((res) => {
        // 返回文件 ID
        // console.log(res.fileID)
        return uploadRes = tcbApp
            .getTempFileURL({
                fileList: [res.fileID]
            })
            .then((res) => {
                // fileList 是一个有如下结构的对象数组
                // [{
                //    fileID: 'cloud://webtestjimmy-5328c3.7765-webtestjimmy-5328c3-1251059088/腾讯云.png', // 文件 ID
                //    tempFileURL: '', // 临时文件网络链接
                //    maxAge: 120 * 60 * 1000, // 有效期
                // }]
                // console.log(res.fileList)
                // resolve(res)
                var uploadRes = res
                return uploadRes
            })
    })

    // uploadRes promiseの中身を解析
    uploadRes = await uploadRes.then(result => {
        // console.log(result.fileList)
       return result.fileList[0]
    })
    // 普通のobjを返す
    return uploadRes
}


const newPost = async (newPost) => {

    const newPostdata = await Post.create(newPost)

    return newPostdata
}

const updatePost = async (id, PostData = {}) => {
    const title = PostData.title
    const content = PostData.content
    const image = PostData.image
    const community = PostData.community
    const event = PostData.event

    const resPost = await Post.findOneAndUpdate(
        {_id: id},
        {title,content,image,community,event},
        {new: true}
    )
    if(Post == null) return false
    return resPost
}

const delPost = async (id) => {
    const resPost = await Post.findByIdAndDelete(
        {_id: id
        })
    if(Post == null) return false
    return resPost
}

module.exports = {
    getList,
    getDetail,
    newPost,
    updatePost,
    delPost,
    upload
}