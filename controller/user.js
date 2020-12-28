// const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const User = require('../db/models/User')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const login = async (email, password) => {

    const userList = await User.find({
        email,
        password
    })
    console.log(userList)
    // console.log("user is "+ userList[0])
    // if(user == null) return {}
    // return user
    //返回了数组
    if(userList.length === 0) {
        console.log("fail")
        return {}
    }

    //　成功の時、payload,secrect,時間　で　token 生成
    const payload = {
        email: userList[0].email,
        id: userList[0]._id
    }
    console.log('payload', payload)
    var token = jwt.sign(payload, 'fb-backend');
    console.log('serve-token', token)
    console.log('jwt verify', jwt.verify(token, 'fb-backend'))
    return {
        success: true,
        token: token
    }
}

const create = async (ctx) => {
    ctx.verifyParams({
        email: {type: 'string', required: true},
        password: { type: 'string', required: true}
    })
    const { email } = ctx.request.body
    const repeatedUser = await User.find({email})
    if(repeatedUser) {
        ctx.throw(409, 'emailはもう使用されてます')
    }
    const user = await new User(ctx.request.body).save()
    ctx.body = user
}

const currentUser = async (email) => {
    const userList = await User.find({
        email
    })
    if(userList.length === 0) {
        console.log("fail")
        return {}
    }
    return userList[0]
    
}

module.exports = {
    login,
    currentUser
}