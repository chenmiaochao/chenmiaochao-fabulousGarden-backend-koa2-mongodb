// const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const User = require('../db/models/User')
const md5 = require('md5')
const jwt = require('jsonwebtoken')

const login = async (email, password) => {
    console.log('login-email:',email,'password',password)
    // password = genPassword(password)
    const userList = await User.find({
        email,
        password
    })
    // console.log(userList)
    // console.log("user is "+ userList[0])
    // if(user == null) return {}
    // return user
    //返回了数组
    if(userList.length === 0) {
        console.log("fail")
        return {}
    }
    const userToken = {
        name: userList.email,
        id: userList._id
      }
    var token = jwt.sign(userToken, 'shhhhh');

    return {
        success: true,
        token: token,
        data: userList[0]
    }
}

module.exports = {
    login
}