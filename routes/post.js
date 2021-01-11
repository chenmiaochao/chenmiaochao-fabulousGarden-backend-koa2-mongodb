const exif = require('exif-js')
const router = require('koa-router')()
const {
  getList,
  getDetail,
  newPost,
  updatePost,
  delPost,
  upload
} = require('../controller/post')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/post')

router.get('/', async function (ctx, next) {
    const listData = await getList()
    console.log(listData)
    ctx.body = new SuccessModel(listData)
})

router.get('/:eid', async function (ctx, next) {
    // console.log("eid",ctx.params)
    const data = await getDetail(ctx.params['eid'])
    ctx.body = new SuccessModel(data)
})

router.post('/upload', loginCheck, async function (ctx, next) {
    const body = ctx.request.files
    const res = await upload(body)
    // console.log(body)
    // todo ::::::
    // 画像laglngを解析記録　返す
    // await console.log(exif.getAllTags(body.photo))
    // await console.log('GPSLatitude',exif.getAllTags(body.photo).GPSLatitude)
    // 以上は時間かかりすぎ。。。
    const data = { imgUrl: res.download_url }
    return ctx.body = new SuccessModel(data,'upload successed')
  })

router.post('/new', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  // console.log(body)
  const data = await newPost(body)
  console.log('newPost Data---------', data)
  ctx.body = new SuccessModel(data)
})

router.patch('/:id', loginCheck, async function (ctx, next) {
    const val = await updatePost(ctx.params.id, ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel(val)
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
