const env = process.env.NODE_ENV//環境変数

//mysql 設定
let MYSQL_CONF
let REDIS_CONF

if(env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'
    }
    //mongo

    //redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }

}

if(env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        port: '3306',
        database: 'myblog'
    }

    //redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }

}
// console.log(MYSQL_CONF);
module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}