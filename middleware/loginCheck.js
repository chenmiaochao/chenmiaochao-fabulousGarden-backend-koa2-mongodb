const { ErrorModel } = require('../model/resModel')

module.exports = async (ctx, next) => {
        console.log('进入中间件')
        if (ctx.header && ctx.header.authorization) {
          const parts = ctx.header.authorization.split(' ');
          if (parts.length === 2) {
            //取出token
            const scheme = parts[0];
            const token = parts[1];
            
            if (/^Bearer$/i.test(scheme)) {
              try {
                //jwt.verify方法验证token是否有效
                jwt.verify(token, 'fb-backend', {
                  complete: true
                });
              } catch (error) {
                //token过期 生成新的token
                const newToken = getToken(user);
                //将新token放入Authorization中返回给前端
                ctx.res.setHeader('Authorization', newToken);
              }
            }
          }
        }
    if (ctx.session.username) {
        await next()
        return
    }
    ctx.body = new ErrorModel('未登录')
}