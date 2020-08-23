const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');

router.prefix('/song')

router.get('/url', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const res = await _requestToQQ.get(request.path, request.query, request.querystring);
        if(res.result !== 100) {
            ctx.body = {errMsg: res.errMsg, code: 400}
        } else {
            ctx.body = {
                data: [{url: res.data, type: request.query.type}],
                code: 200
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

// 暂未用到
// router.get('/detail', async (ctx, next) => {
//     const request = ctx.request;
//     if(!/^(\d+)$/g.test(request.query.id)) {
//         ctx.body = await _requestToQQ.get(request.path, request.query, request.querystring);
//     } else {
//         ctx.body = await _request.get(request.path, request.query, request.querystring);
//     }
// })




module.exports = router