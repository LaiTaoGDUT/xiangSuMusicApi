const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const normalAlbum = require('../formChange/album')
router.prefix('/album')


router.get('/', async (ctx, next) => {
    const request = ctx.request;
    if(!request.query.id) {
        ctx.body = {errMsg: res.errMsg, code: 400}
    }
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        ctx.body = await getQQAlbum(request)
    } else {
        try {
            const res = await _request.get(request.path, request.query, request.querystring);
            if(res.code != 200) {
                ctx.body = await getQQAlbum (request)
            } else {
                ctx.body = res
            }
        } catch (err) {
            ctx.body = await getQQAlbum (request)
        } 
    }
})

async function getQQAlbum (request) {
    let qqRequest = {
        albummid: request.query.id
    }
    const res = await _requestToQQ.get(request.path, qqRequest, encodeURI(`albummid=${request.query.id}`));
    if(res.result !== 100) { // 没有专辑
        return {
            songs: [],
            code: 200,
            album: {
                description: "未知专辑",
                name: "未知专辑",
                id: request.query.id,
                type: "专辑",
                publishTime: new Date().getTime(),
                picUrl: 'https://p1.music.126.net/srjmIxgdjRlCXSjZtl2aaw==/109951163825045428.jpg',
                info: {
                    shareCount: 0,
                    commentCount: 0
                },
                platform: 'qq'
            },
            artists: [],
            platform: 'qq'
        }
    } else {
        return await normalAlbum(res)
    }
}

module.exports = router