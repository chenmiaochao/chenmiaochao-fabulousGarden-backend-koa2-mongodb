const router = require('koa-router')()
const {
  getList,
  getDetail,
  newEvent,
  updateEvent,
  delEvent
} = require('../controller/event')
const jalanUrl = require('../serc.json').url
const access_token = require('../serc.json').access_token
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
const { default: axios } = require('axios')
const xml2js = require('xml2js')
const convert = require('xml-js')

router.prefix('/api/event')

router.get('/', async function (ctx, next) {

    const listData = await getList()
    // console.log(listData)
    ctx.body = new SuccessModel(listData)
})

router.get('/jalan', async function (ctx, next) {
    let params = ctx.query
    const xmlData = axios.get(jalanUrl, {params}).then(data => {
        // console.log(data)
        return data
    })
    const xml = await xmlData
    xmlParser = new xml2js.Parser()
    xmlParser.parseString(xml.data, function (err, result) {
        // console.dir(result.Results.Hotel);
        var data = result.Results.Hotel
        // console.log(data)
        // console.log('Done');

        ctx.body = new SuccessModel(data)
    })

})

router.get('/yahooGeoAddr', async function (ctx, next) {
    console.log(ctx.query.params)
    const str = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ctx.query.params+'.json?worldview=jp&types=address&access_token='+access_token
    const uri = encodeURI(str)
    // console.log('----------', uri)
    //axios data 外に出す成功例

    const resData = await axios.get(uri).then(data => {
        console.log(data.data.features)
        let resArr = []
        for(let i = 0; i< data.data.features.length; i++){
            // console.log(data.data.features[i])
            resArr.push({
                "text": data.data.features[i].text,
                "address": data.data.features[i].place_name
            })
        }
        console.log(resArr)
        // return result
        ctx.body = new SuccessModel(resArr)
    })
})

router.post('/yahooGeo', async function (ctx, next) {
    let body = ctx.request.body
    // console.log(body)
    //成功したyahooGeo
    body = body.data
    // console.dir(body)
    var makersArray = []
    var latArr = []
    var lngArr = []
    for(let i = 0; i < body.length; i++){
        // console.log(body[i].HotelAddress)
        const str = 'https://map.yahooapis.jp/geocode/cont/V1/contentsGeoCoder?appid=dj00aiZpPVZkUWNvYlVNazUweSZzPWNvbnN1bWVyc2VjcmV0Jng9MmE-&query='+body[i].HotelAddress
        const uri = encodeURI(str)
        // console.log('----------', uri)
        //axios data 外に出す成功例
        const xmldata = await axios.get(uri).then(data => {
            // console.log(data.data)
            const options = { compact: true,ignoreComment: true, alwaysChildren: false };
            const result = convert.xml2js(data.data, options);
            // console.log(result.YDF.Feature.Geometry)
            if(result.YDF.Feature.Geometry){
                // console.log(result.YDF.Feature.Geometry.Coordinates._text)
                const strArr = result.YDF.Feature.Geometry.Coordinates._text.split(",")
                // console.log(strArr)
                latArr.push(+strArr[1])
                lngArr.push(+strArr[0])
                makersArray.push({ 
                    position:{lat:+strArr[1], lng:+strArr[0] },
                    title: body[i].HotelAddress[0],
                    draggable: false
                })
            }
            // return result
        })
    }
    // console.log(makersArray)
    let latSum = latArr.reduce((previous, current) => current += previous);
    let lngSum = lngArr.reduce((previous, current) => current += previous);

    ctx.body = new SuccessModel(makersArray)
})
router.get('/:eid', async function (ctx, next) {
    // console.log("eid",ctx.params)
    const data = await getDetail(ctx.params['eid'])
    console.log(data)
    ctx.body = new SuccessModel(data)
})

router.post('/new', loginCheck, async function (ctx, next) {
    const avatar = await axios.get('https://api.thecatapi.com/v1/images/search?limt=1').then(res => {
        console.log(res.data[0].url)
        return res.data[0].url
    })
    const body = ctx.request.body
    body.avatar = avatar
    // console.log(body)
    const data = await newEvent(body)
    // console.log(data)
    ctx.body = new SuccessModel(data)
})
// router.patch('/:id', loginCheck, async function (ctx, next) {
router.patch('/:id', loginCheck, async function (ctx, next) {
    console.log('ctx.query[id]', ctx.params['id'])

    const val = await updateEvent(ctx.params['id'], ctx.request.body)
    if (val) {
        ctx.body = new SuccessModel(val)
    } else {
        ctx.body = new ErrorModel('更新博客失败')
    }
})


router.delete('/:id', loginCheck, async function (ctx, next) {

    const val = await delEvent(ctx.params.id)
    if (val) {
        ctx.body = new SuccessModel(val)
    } else {
        ctx.body = new ErrorModel('删除博客失败')
    }
  })
module.exports = router
