const router = require('koa-router')()
const {
  getList,
  getDetail,
  newPost,
  updatePost,
  delPost
} = require('../controller/post')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/post')

router.get('/', async function (ctx, next) {
    // let author = ctx.query.author || ''
    // const keyword = ctx.query.keyword || ''
    // let cid = ctx.query.cid || ''
    // if (ctx.query.isadmin) {
    //     console.log('is admin')
    //     // 管理员界面
    //     if (ctx.session.username == null) {
    //         console.error('is admin, but no login')
    //         // 未登录
    //         ctx.body = new ErrorModel('未登录')
    //         return
    //     }
    //     // 强制查询自己的博客
    //     author = ctx.session.username
    // }

    // const listData = await getList(author, keyword)
    const listData = await getList()
    // console.log(listData)
    ctx.body = new SuccessModel(listData)
})

router.get('/:eid', async function (ctx, next) {
    // console.log("eid",ctx.params)
    const data = await getDetail(ctx.params['eid'])
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newPost(body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
    const val = await updatePost(ctx.query.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, async function (ctx, next) {
  const author = ctx.session.username
  const val = await delPost(ctx.query.id, author)
  if (val) {
      ctx.body = new SuccessModel()
  } else {
      ctx.body = new ErrorModel('删除博客失败')
  }
})

module.exports = router
