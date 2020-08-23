const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const { normalArtist, normalArtistSongs, normalArtistAlbums, normalArtistMv } = require('../formChange/normalArtist')

router.get('/artists', async (ctx, next) => {
    const request = ctx.request;
    let qqRequest = {
        singermid: request.query.id,
        pageSize: request.query.limit ? request.query.limit : 20,
        pageNo: request.query.offset ? Math.floor(request.query.offset / request.query.limit) + 1 : 1,
    }
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const res = await _requestToQQ.get('/singer/songs', request.query, encodeURI(`singermid=${qqRequest.singermid}&pageSize=${qqRequest.pageSize}&pageNo=${qqRequest.pageNo}&raw=1`));
        if(res.code != 0) {
            ctx.body = {
                artist: {
                    platform: 'qq'
                },
                hotSongs: [],
                platform: 'qq',
                code: 200
            }
        } else {
            let hotSongs = await normalArtistSongs(res.singer.data.songlist)
            ctx.body = {
                artist: normalArtist(res.singer.data),
                hotSongs: hotSongs,
                code: 200,
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

router.get('/artist/album', async (ctx, next) => {
    const request = ctx.request;
    let qqRequest = {
        singermid: request.query.id,
        pageSize: request.query.limit ? request.query.limit : 20,
        pageNo: request.query.offset ? Math.floor(request.query.offset / request.query.limit) + 1 : 1,
    }
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const res = await _requestToQQ.get('/singer/album', request.query, encodeURI(`singermid=${qqRequest.singermid}&pageSize=${qqRequest.pageSize}&pageNo=${qqRequest.pageNo}&raw=1`));
        if(res.code != 0) {
            ctx.body = {
                hotAlbums: [],
                more: false,
                code: 200,
                platform: 'qq'
            }
        } else {
            ctx.body = {
                hotAlbums: normalArtistAlbums(res.singerAlbum.data.list),
                more: res.singerAlbum.data.total - (qqRequest.pageSize * qqRequest.pageNo) > 0,
                code: 200,
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

router.get('/artist/desc', async (ctx, next) => {
    const request = ctx.request;
    let qqRequest = {
        singermid: request.query.id,
    }
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const res = await _requestToQQ.get('/singer/desc', request.query, encodeURI(`singermid=${qqRequest.singermid}`));
        if(res.result != 100) {
            ctx.body = {
                introduction: [],
                briefDesc: '',
                topicData: [],
                code: 200,
                platform: 'qq'
            }
        } else {
            let introduction = res.data.basic.item.concat(res.data.other.item)
            ctx.body = {
                introduction: introduction.map(item => {
                    return {
                        ti: item.key,
                        txt: item.value
                    }
                }),
                briefDesc: res.data.desc,
                topicData: [],
                code: 200,
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

router.get('/artist/mv', async (ctx, next) => {
    const request = ctx.request;
    let qqRequest = {
        singermid: request.query.id,
    }
    if(request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const res = await _requestToQQ.get('/singer/mv', request.query, encodeURI(`singermid=${qqRequest.singermid}`));
        if(res.result != 100) {
            ctx.body = {
                mvs: [],
                time: Date.now(),
                hasMore: false,
                code: 200,
                platform: 'qq'
            }
        } else {
            ctx.body = {
                mvs: normalArtistMv(res.data.list),
                time: Date.now(),
                hasMore: false,
                code: 200,
                platform: 'qq'
            }
        }
    } else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

module.exports = router