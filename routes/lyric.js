const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const normalLyric = require('../formChange/lyric')
router.prefix('/lyric')

router.get('/', async (ctx, next) => {
    const request = ctx.request;
    if(!/^(\d+)$/g.test(request.query.id)) {
        let qqQuery = {
            songmid: request.query.id
        }
        const res = await _requestToQQ.get(request.path, qqQuery, encodeURI(`songmid=${request.query.id}`));
        if(res.result !== 100) {
            ctx.body = {errMsg: res.errMsg, code: 400}
        } else {
            ctx.body = normalLyric(res)
        }
    } else {
        const res = await _request.get(request.path, request.query, request.querystring);
        if(res.tlyric && res.tlyric.lyric) {
            res.tlyric.lyric = res.tlyric.lyric.replace(/(by:)(\w)+/, '').replace(/[[]]\n/, '')
        }
        ctx.body = res
    }
})






module.exports = router