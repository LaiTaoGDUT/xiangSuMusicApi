const router = require('koa-router')();
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const normalComment = require('../formChange/comment');
const getQQSongId = require('../utils/getQQSongId');
const getQQAlbumId = require('../utils/getQQAlbumId');
router.prefix('/comment')

router.get('/music', async (ctx, next) => {
    const request = ctx.request;
    if (!request.query.id) {
        ctx.body = { errMsg: res.errMsg, code: 400 }
    }
    if (request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        const songid = await getQQSongId(request.query.id)
        const qqRequest = {
            id: songid,
            pageSize: request.query.limit ? request.query.limit : 20,
            pageNo: request.query.offset ? Math.floor(request.query.offset / request.query.limit) + 1 : 1,
            biztype: 1
        }
        const res = await _requestToQQ.get('/comment', qqRequest, encodeURI(`id=${songid}&pageSize=${qqRequest.pageSize}&pageNo=${qqRequest.pageNo}&biztype=${qqRequest.biztype}`));
        if (res.result != 100) {
            ctx.body = {
                hotComments: [],
                comments: [],
                topComments: [],
                total: 0,
                code: 200,
                platform: "qq",
                more: false
            }
        } else {
            let changedRes = {
                hotComments: res.data.hotComment ? normalComment(res.data.hotComment.commentlist) : [],
                comments: normalComment(res.data.comment.commentlist),
                topComments: [],
                total: res.data.comment.commenttotal,
                code: 200,
                platform: "qq",
                more: res.data.comment.commenttotal - (qqRequest.pageSize * qqRequest.pageNo) > 0
            }
            ctx.body = changedRes
        }
    } else {
        const res = await _request.get(request.path, request.query, request.querystring);
        ctx.body = res
    }
})

router.get('/album', async (ctx, next) => {
    const request = ctx.request;
    if (!request.query.id) {
        ctx.body = { errMsg: res.errMsg, code: 400 }
    }
    if (request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        ctx.body = await getQQAlbumComment (request)
    } else {
        try {
            const res = await _request.get(request.path, request.query, request.querystring);
            if(res.code != 200) {
                ctx.body = await getQQAlbumComment (request)
            } else if (res.total == 0) {
                ctx.body = await getQQAlbumComment (request)
            } else {
                ctx.body = res
            }
        } catch (err) {
            ctx.body = await getQQAlbumComment (request)
        }        
    }
})

router.get('/playlist', async (ctx, next) => {
    const request = ctx.request;
    if (!request.query.id) {
        ctx.body = { errMsg: res.errMsg, code: 400 }
    }
    if (request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        ctx.body = await getQQPlaylistComment (request)
    } else {
        try {
            const res = await _request.get(request.path, request.query, request.querystring);
            if(res.code != 200) {
                ctx.body = await getQQPlaylistComment (request)
            } else if (res.total == 0) {
                ctx.body = await getQQPlaylistComment (request)
            } else {
                ctx.body = res
            }
        } catch (err) {
            ctx.body = await getQQPlaylistComment (request)
        }        
    }
})

router.get('/mv', async (ctx, next) => {
    const request = ctx.request;
    if (!request.query.id) {
        ctx.body = { errMsg: res.errMsg, code: 400 }
    }
    if (request.query.platform == 'qq' || !/^(\d+)$/g.test(request.query.id)) {
        ctx.body = await getQQMvComment (request)
    } else {
        try {
            const res = await _request.get(request.path, request.query, request.querystring);
            if(res.code != 200) {
                ctx.body = await getQQMvComment (request)
            } else if (res.total == 0) {
                ctx.body = await getQQMvComment (request)
            } else {
                ctx.body = res
            }
        } catch (err) {
            ctx.body = await getQQMvComment (request)
        }        
    }
})

async function getQQAlbumComment (request) {
    const albumId = await getQQAlbumId(request.query.id)
    if (!albumId) {
        return {
            hotComments: [],
            comments: [],
            topComments: [],
            total: 0,
            code: 200,
            platform: "qq",
            more: false
        }
    }
    const qqRequest = {
        id: albumId,
        pageSize: request.query.limit ? request.query.limit : 20,
        pageNo: request.query.offset ? Math.floor(request.query.offset / request.query.limit) + 1 : 1,
        biztype: 2
    }
    const res = await _requestToQQ.get('/comment', qqRequest, encodeURI(`id=${albumId}&pageSize=${qqRequest.pageSize}&pageNo=${qqRequest.pageNo}&biztype=${qqRequest.biztype}`));
    if (res.result !== 100) {
        return {
            hotComments: [],
            comments: [],
            topComments: [],
            total: 0,
            code: 200,
            platform: "qq",
            more: false
        }
    } else {
        let changedRes = {
            hotComments: normalComment(res.data.hotComment.commentlist),
            comments: normalComment(res.data.comment.commentlist),
            topComments: [],
            total: res.data.comment.commenttotal,
            code: 200,
            platform: "qq",
            more: res.data.comment.commenttotal - (qqRequest.pageSize * qqRequest.pageNo) > 0
        }
        return changedRes
    }
}

async function getQQPlaylistComment (request) {
    const playlistId = request.query.id
    if (!playlistId) {
        return {
            hotComments: [],
            comments: [],
            topComments: [],
            total: 0,
            code: 200,
            platform: "qq",
            more: false
        }
    }
    const qqRequest = {
        id: playlistId,
        pageSize: request.query.limit ? request.query.limit : 20,
        pageNo: request.query.offset ? Math.floor(request.query.offset / request.query.limit) + 1 : 1,
        biztype: 3
    }
    const res = await _requestToQQ.get('/comment', qqRequest, encodeURI(`id=${playlistId}&pageSize=${qqRequest.pageSize}&pageNo=${qqRequest.pageNo}&biztype=${qqRequest.biztype}`));
    if (res.result !== 100) {
        return {
            hotComments: [],
            comments: [],
            topComments: [],
            total: 0,
            code: 200,
            platform: "qq",
            more: false
        }
    } else {
        let changedRes = {
            hotComments: normalComment(res.data.hotComment.commentlist),
            comments: normalComment(res.data.comment.commentlist),
            topComments: [],
            total: res.data.comment.commenttotal,
            code: 200,
            platform: "qq",
            more: res.data.comment.commenttotal - (qqRequest.pageSize * qqRequest.pageNo) > 0
        }
        return changedRes
    }
}

async function getQQMvComment (request) {
    const mvId = request.query.id
    if (!mvId) {
        return {
            hotComments: [],
            comments: [],
            topComments: [],
            total: 0,
            code: 200,
            platform: "qq",
            more: false
        }
    }
    const qqRequest = {
        id: mvId,
        pageSize: request.query.limit ? request.query.limit : 20,
        pageNo: request.query.offset ? Math.floor(request.query.offset / request.query.limit) + 1 : 1,
        biztype: 5
    }
    const res = await _requestToQQ.get('/comment', qqRequest, encodeURI(`id=${mvId}&pageSize=${qqRequest.pageSize}&pageNo=${qqRequest.pageNo}&biztype=${qqRequest.biztype}`));
    if (res.result !== 100) {
        return {
            hotComments: [],
            comments: [],
            topComments: [],
            total: 0,
            code: 200,
            platform: "qq",
            more: false
        }
    } else {
        let changedRes = {
            hotComments: normalComment(res.data.hotComment.commentlist),
            comments: normalComment(res.data.comment.commentlist),
            topComments: [],
            total: res.data.comment.commenttotal,
            code: 200,
            platform: "qq",
            more: res.data.comment.commenttotal - (qqRequest.pageSize * qqRequest.pageNo) > 0
        }
        return changedRes
    }
}

module.exports = router