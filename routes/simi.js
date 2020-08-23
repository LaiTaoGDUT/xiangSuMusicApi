const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const getQQSongId = require('../utils/getQQSongId');
const { normalSimiPlaylist } = require('../formChange/playlist');
const { normalSimiSongs } = require('../formChange/song');
const { normalSimiArtists } = require('../formChange/normalArtist')
router.prefix('/simi')

router.get('/playlist', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const songid = await getQQSongId(request.query.id)
        const qqRequest = {
            id: songid,
        }
        const res = await _requestToQQ.get('/song/playlist', qqRequest, encodeURI(`id=${songid}`));
        if(res.result !== 100) {
            ctx.body = {
                playlists: [],
                code: 200,
                platform: 'qq'
            }
        } else {
            ctx.body = {
                playlists: normalSimiPlaylist(res.data),
                code: 200,
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

router.get('/song', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const songid = await getQQSongId(request.query.id)
        const qqRequest = {
            id: songid,
        }
        const res = await _requestToQQ.get('/song/similar', qqRequest, encodeURI(`id=${songid}`));
        if(res.result !== 100) {
            ctx.body = {
                songs: [],
                code: 200,
                platform: 'qq'
            }
        } else {
            ctx.body = {
                songs: await normalSimiSongs(res.data),
                code: 200,
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

router.get('/artist', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const qqRequest = {
            singermid: request.query.id,
        }
        const res = await _requestToQQ.get('/singer/sim', qqRequest, encodeURI(`singermid=${request.query.id}`));
        if(res.result !== 100) {
            ctx.body = {
                artists: [],
                code: 200,
                platform: 'qq'
            }
        } else {
            ctx.body = {
                artists: normalSimiArtists(res.data.list),
                code: 200,
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

//获取最近 5 个听了这首歌的用户 (接口baba还没有这个接口啊)
router.get('/user', async (ctx, next) => {
    const request = ctx.request;
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        // const songid = await getQQSongId(request.query.id)
        // const qqRequest = {
        //     id: songid,
        // }
        // const res = await _requestToQQ.get('/song/similar', qqRequest, encodeURI(`id=${songid}`));
        // if(res.result !== 100) {
        //     ctx.body = {
        //         songs: [],
        //         code: 200
        //     }
        // } else {
        //     ctx.body = {
        //         songs: await normalSimiSongs(res.data),
        //         code: 200
        //     }
        // }
        ctx.body = {
            userprofiles: [],
            code: 200,
            code: 200
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

module.exports = router