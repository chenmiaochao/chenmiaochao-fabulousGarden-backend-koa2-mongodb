const { ErrorModel } = require('../model/resModel')
const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
    console.log('进入中间件')
    if (ctx.header && ctx.header.authorization) {

        var token = ctx.headers.authorization
        if(token.split(' ')[1] == ''){
            ctx.body = new ErrorModel('未登录')
            return
        }

        }
        // console.log('loginCheck',jwt.verify(token.split(' ')[1], 'fb-backend'), '88中间件')
        await next()
        return
    // sessionにはusername保持していないため
    // if (ctx.session.username) {
    //     await next()
    //     return
    // }
    // ctx.body = new ErrorModel('未登录')
}