const router = require('koa-router')()
const json = require('koa-json')
const { login, currentUser } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const jwt = require('jsonwebtoken')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { email, password } = ctx.request.body
    const data = await login(email, password)
    // const userData = JSON.stringify(data);
    console.log(data)
    if (data.token) {
        //tokenを返す
        ctx.body = data
        return
    }
    ctx.body = new ErrorModel('ログイン失败')
})


router.get('/current', async function (ctx, next) {
    let token = ctx.headers.authorization
    console.log(jwt.verify(token.split(' ')[1], 'fb-backend'))
    const data = await currentUser(jwt.verify(token.split(' ')[1], 'fb-backend').email)
    ctx.body = data
})

module.exports = router