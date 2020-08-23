const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const { normalPlaylist } = require('../formChange/playlist');

router.prefix('/playlist')

router.get('/detail', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        ctx.body = await getQQPlaylist(request.query.id)
    } else {
        try {
            const res = await _request.get(request.path, request.query, request.querystring);
            if(res.code != 200) {
                ctx.body = await getQQPlaylist (request.query.id)
            } else {
                ctx.body = res
            }
        } catch (err) {
            ctx.body = await getQQPlaylist (request.query.id)
        }
    }
})

//QQ音乐还没这个接口呢。。。
router.get('/subscribers', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        ctx.body = {
            code: 200,
            platform: 'qq',
            more: false,
            subscribers: []
        }
    } else {
        const res = await _request.get(request.path, request.query, request.querystring);
        if(res.code != 200) {
            ctx.body = {
                code: 200,
                more: false,
                subscribers: []
            }
        } else {
            ctx.body = res
        }
    }
})

async function getQQPlaylist(id) {
    const qqQuery = {
        id
    }
    const res = await _requestToQQ.get('/songlist', qqQuery, encodeURI(`id=${id}`));
    if(res.result !== 100) {
        return {
            playlist: await normalPlaylist(null),
            code: 200,
            platform: 'qq'
        }
    } else {
        return {
            playlist: await normalPlaylist(res.data),
            code: 200,
            platform: 'qq'
        }
    }
}

module.exports = router