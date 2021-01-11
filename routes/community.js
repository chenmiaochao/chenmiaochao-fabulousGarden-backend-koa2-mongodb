const router = require('koa-router')()
const fs = require('fs')
const perfContent = require('./content')
const {
  getList,
  getAllList,
  getDetail,
  newCommunity,
  updateCommunity,
  delCommunity
} = require('../controller/community')
const {
    newEvent,
  } = require('../controller/event')
const axios = require('axios')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
const { isArray } = require('util')

router.prefix('/api/community')

router.get('/', async function (ctx, next) {
    const listData = await getList()
    // console.log(listData)
    ctx.body = new SuccessModel(listData)
})

router.get('/perfOri', async function (ctx, next,) {
    const perfContent = require('./content')

    ctx.body = new SuccessModel(perfContent)
})

router.get('/jalanperf', async function (ctx, next,) {
    const perfContent = require('../jalanPrefecure')

    ctx.body = new SuccessModel(perfContent)
})

router.get('/perf', async function (ctx, next,) {
    const perfContent = require('./content')
    // console.log(perfContent)
    let obj = {
        province_list: {},
        city_list: {},
        county_list: {}
    }
    for(i in perfContent.Region) {
        // console.log(perfContent.Region[i])
        //Region取得、書き込み
        if(Array.isArray(perfContent.Region[i].Prefecture)){
            // Prefectureがarray
            for(let l in perfContent.Region[i].Prefecture){
                obj.province_list[perfContent.Region[i].Prefecture[l]['cd']] = perfContent.Region[i].Prefecture[l]['name']
                for(let k in perfContent.Region[i].Prefecture[l].LargeArea){
                    // console.log(perfContent.Region[i].Prefecture[l].LargeArea[k]['cd'],'-----------------',perfContent.Region[i].Prefecture[l].LargeArea[k]['name'])
                    obj.city_list[perfContent.Region[i].Prefecture[l].LargeArea[k]['cd']] = perfContent.Region[i].Prefecture[l].LargeArea[k]['name']
                        //small area　はarray
                    if(Array.isArray(perfContent.Region[i].Prefecture[l].LargeArea[k]['SmallArea'])){
                        // console.log(perfContent.Region[i].Prefecture[l].LargeArea[k]['SmallArea'],'smal area--------------small a')
                        for(let j in perfContent.Region[i].Prefecture[l].LargeArea[k]['SmallArea']){
                            obj.county_list[perfContent.Region[i].Prefecture[l].LargeArea[k]['SmallArea'][j].cd] = perfContent.Region[i].Prefecture[l].LargeArea[k]['SmallArea'][j].name
                        }
                    }else{
                        obj.county_list[perfContent.Region[i].Prefecture[l].LargeArea[k]['SmallArea'].cd] = perfContent.Region[i].Prefecture[l].LargeArea[k]['SmallArea'].name
                    }
                }
            }
        }else{
            obj.province_list[perfContent.Region[i].Prefecture.cd] = perfContent.Region[i].Prefecture.name
            for(let k in perfContent.Region[i].Prefecture.LargeArea){
                // console.log(perfContent.Region[i].Prefecture.LargeArea[k]['cd'],'-----------------',perfContent.Region[i].Prefecture.LargeArea[k]['name'])
                obj.city_list[perfContent.Region[i].Prefecture.LargeArea[k]['cd']] = perfContent.Region[i].Prefecture.LargeArea[k]['name']
                //small areaがarray?
                if(Array.isArray(perfContent.Region[i].Prefecture.LargeArea[k]['SmallArea'])){
                    for(let u in perfContent.Region[i].Prefecture.LargeArea[k]['SmallArea'])
                    obj.county_list[perfContent.Region[i].Prefecture.LargeArea[k]['SmallArea'][u].cd] = perfContent.Region[i].Prefecture.LargeArea[k]['SmallArea'][u].name
                }else{
                    obj.county_list[perfContent.Region[i].Prefecture.LargeArea[k]['SmallArea'].cd] = perfContent.Region[i].Prefecture.LargeArea[k]['SmallArea'].name
                }
                // console.log(obj.county_list)
            }
        }

    }
    // console.log('obj',obj)
    const newperfContent = JSON.stringify(obj)
    fs.writeFile('./myFile.json', newperfContent, function(err){ 
        if(err){
        console.log(err);
        }
    })
    ctx.body = new SuccessModel(perfContent)
})

router.get('/all', async function(ctx, next) {
    const AllListData = await getAllList()
    // console.log(AllListData)
    ctx.body=  new SuccessModel(AllListData)
})


router.get('/:cid', async function (ctx, next) {
    // console.log('cid',ctx.params['cid'])
    const data = await getDetail(ctx.params['cid'])
    console.log('find cid', data)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
    
  const body = ctx.request.body
  const avatar = await axios.get('https://api.thecatapi.com/v1/images/search?limt=1').then(res => {
    // console.log(res.data[0].url)
    return res.data[0].url
  })

    // console.log("avatar",avatar)
    body.avatar = avatar
    console.log(body)
    const data = await newCommunity(body)
    console.log('communitydata', data)
    const defaultEvent = {
        avatar: avatar,
        eventName: body.communityName + '初めてのイベント',
        description: 'デフォルトのイベント',
        author: body.author,
        date: new Date(),
        place: '',
        price: '',
        community: data._id
      }
    const data2 = await newEvent(defaultEvent)
    //新規コミュニティ創生後、デフォルトの一個イベント作成
    ctx.body = new SuccessModel(data)
})

router.patch('/:id', loginCheck, async function (ctx, next) {
    // console.log('ctx.params[id]', ctx.params['id'])

    // console.log('ctx.request.body', ctx.request.body)
    const val = await updateCommunity(ctx.params['id'], ctx.request.body)
    console.log('resVal', val)
    if (val) {
        ctx.body = new SuccessModel(val)
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})

router.delete('/:id', loginCheck, async function (ctx, next) {

    const val = await delCommunity(ctx.params.id)
    if (val) {
        ctx.body = new SuccessModel(val)
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }
  })

module.exports = router
