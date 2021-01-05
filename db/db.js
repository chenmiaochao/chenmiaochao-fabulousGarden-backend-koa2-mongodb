const mongoose = require('mongoose')

const url = 'mongodb://115.159.115.210:27017'
const dbName = 'fb'

mongoose.connect(`${url}/${dbName}`, {
    useNewUrlParser: true,
     useUnifiedTopology: true 
    //配置
})
mongoose.set('useCreateIndex', true)
const db = mongoose.connection

//发生错误
db.on('error',err=>{
    console.error(err)
})

// //连接成功
// db.once('open',()=>{
//     console.log('mongoose connect success...');
// })

module.exports = mongoose