const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const { normalMv, normalMvList } = require('../formChange/normalMv');

router.prefix('/mv')

router.get('/url', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const res = await _requestToQQ.get(request.path, request.query, request.querystring);
        if(res.result !== 100) {
            ctx.body = {
                code: 200,
                data: {
                    id: request.query.id,
                    url: '',
                },
                platform: 'qq'
            }
        } else {
            ctx.body = {
                code: 200,
                data: {
                    id: request.query.id,
                    url: res.data[request.query.id][res.data[request.query.id].length - 1],
                },
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

router.get('/detail', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.mvid)) {
        let QQRequest = {
            id: request.query.mvid
        }
        const res = await _requestToQQ.get('/mv', QQRequest, encodeURI(`id=${request.query.mvid}`));
        if(res.result !== 100) {
            ctx.body = {
                code: 200,
                data: {
                    id: request.query.id,
                    platform: 'qq'
                },
                platform: 'qq'
            }
        } else {
            ctx.body = {
                code: 200,
                data: normalMv(res.data.info),
                recommend: normalMvList(res.data.recommend),
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

module.exports = router