const router = require('koa-router')()
const {
  getList,
  getAllList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require('../controller/community')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/community')

router.get('/', async function (ctx, next) {
    const listData = await getList()
    // console.log(listData)
    ctx.body = new SuccessModel(listData)
})

router.get('/all', async function(ctx, next) {
    const AllListData = await getAllList()
    console.log(AllListData)
    ctx.body=  new SuccessModel(AllListData)
})


router.get('/:cid', async function (ctx, next) {
    // console.log('cid',ctx.params['cid'])
    const data = await getDetail(ctx.params['cid'])
    // console.log('find cid', data)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  body.author = ctx.session.username
  const data = await newBlog(body)
  ctx.body = new SuccessModel(data)
})

router.post('/update', loginCheck, async function (ctx, next) {
    const val = await updateBlog(ctx.query.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel()
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.post('/del', loginCheck, async function (ctx, next) {
  const author = ctx.session.username
  const val = await delBlog(ctx.query.id, author)
  if (val) {
      ctx.body = new SuccessModel()
  } else {
      ctx.body = new ErrorModel('删除博客失败')
  }
})

module.exports = router
