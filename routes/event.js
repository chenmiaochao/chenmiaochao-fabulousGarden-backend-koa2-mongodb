const router = require('koa-router')()
const {
  getList,
  getDetail,
  newEvent,
  updateEvent,
  delEvent
} = require('../controller/event')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/event')

router.get('/', async function (ctx, next) {

    const listData = await getList()
    console.log(listData)
    // console.log(listData)
    ctx.body = new SuccessModel(listData)
})

router.get('/:eid', async function (ctx, next) {
    // console.log("eid",ctx.params)
    const data = await getDetail(ctx.params['eid'])
    console.log(data)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newEvent(body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
    const val = await updateEvent(ctx.query.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, async function (ctx, next) {
  const author = ctx.session.username
  const val = await delEvent(ctx.query.id, author)
  if (val) {
      ctx.body = new SuccessModel()
  } else {
      ctx.body = new ErrorModel('删除博客失败')
  }
})

module.exports = router
