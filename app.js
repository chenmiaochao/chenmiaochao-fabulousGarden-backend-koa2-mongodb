const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')
const koaJwt = require('koa-jwt')
const koaBody = require('koa-body')
const index = require('./routes/index')
const users = require('./routes/users')
const blog  = require('./routes/blog')
const user  = require('./routes/user')
const community  = require('./routes/community')
const event  = require('./routes/event')
const post  = require('./routes/post')

const { REDIS_CONF } = require('./conf/db')

// error handler
onerror(app)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const ENV = process.env.NODE_ENV
if(ENV != 'production') {
  //开发环境/ 测试环境
  app.use(morgan('dev'));
} else{
  //线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}
// session 配置
// app.keys = ['WJiol#23123_']
// app.use(session({
//   // 配置 cookie
//   cookie: {
//     path: '/',
//     httpOnly: true,
//     maxAge: 24 * 60 * 60 * 1000
//   },
//   // 配置 redis
//   store: redisStore({
//     // all: '127.0.0.1:6379'   // 写死本地的 redis
//     all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
//   })
// }))

//koa-body 
app.use(koaBody({
  multipart: true,  //设置支持文件格式
  formidable: {
   //这是个 node 包, 设置一下选项
   uploadDir: path.join(__dirname,'/public/uploads'), //设置上传目录
   keepExtensions: true,  //设置文件后缀名保留
  }
}))

// routes jwt認証、問題あり、
// app.use(
//   koaJwt({
//     secret: 'fb-backend'
//   }).unless({
//     path: [
//       '/api/user/login',
//       '/api/user/current',
//       '/api/community',
//       '/api/event',
//       '/api/event/',
//       '/api/post',
//       '/api/post/'
//     ]
//   })
// )
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(community.routes(), community.allowedMethods())
app.use(event.routes(), event.allowedMethods())
app.use(post.routes(), post.allowedMethods())


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
