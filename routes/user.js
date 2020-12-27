const router = require('koa-router')()
const json = require('koa-json')
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { email, password } = ctx.request.body
    console.log('payload', ctx.request.body)
    const data = await login(email, password)
    // const userData = JSON.stringify(data);
    console.log(data)
    if (data.token) {
        // 设置 session
        // ctx.session.email = data.email
        // ctx.session.realname = data.realname

        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('登录失败')
})

// router.get('/session-test', async function (ctx, next) {
//   if (ctx.session.viewCount == null) {
//     ctx.session.viewCount = 0
//   }
//   ctx.session.viewCount++

//   ctx.body ={
//     errno: 0,
//     viewCount: ctx.session.viewCount
//   }
// })

module.exports = router