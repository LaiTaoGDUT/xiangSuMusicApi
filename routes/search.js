const router = require('koa-router')()
const _request = require('../utils/request');
const _requestToQQ = require('../utils/requestToQQ');
const { normalSearchResult } = require('../formChange/searchResult')
const { normalSearchSuggestResult } = require('../formChange/searchSuggestResult')
router.prefix('/search')

const searchTypeMap = new Map()
searchTypeMap.set("1", 0)
searchTypeMap.set("10", 8)
searchTypeMap.set("100", 9)
searchTypeMap.set("1000", 2)
searchTypeMap.set("1006", 7)
searchTypeMap.set("1004", 12)

router.get('/', async (ctx, next) => {
    const request = ctx.request;
    let key = request.query.keywords
    let type = request.query.type || 1
    let limit = request.query.limit || 30
    let offset = request.query.offset || 0
    if(type == 1 || type == 10 || type == 100 || type == 1000) {  // 搜索音乐，专辑
        if(searchTypeMap.has(type)) { // QQ music has this search type
            const qqQuery = {
                key: key,
                type: searchTypeMap.get(type),
                pageSize: Math.floor(limit / 2), // search limits need to average
                pageNo: Math.floor(Math.floor(offset / 2) / Math.floor(limit / 2)) + 1
            }
            const qqQueryString = encodeURI(`key=${key}&t=${qqQuery.type}&pageSize=${qqQuery.pageSize}&pageNo=${qqQuery.pageNo}`)
            const qqRes = await _requestToQQ.get(request.path, qqQuery, qqQueryString);
            if(qqRes.result == 100) {
                const cloudQuery = {
                    keywords: key,
                    type,
                    limit: Math.ceil(limit / 2),
                    offset: Math.ceil(offset / 2)
                }
                const cloudQueryString = encodeURI(`keywords=${key}&type=${type}&limit=${cloudQuery.limit}&offset=${cloudQuery.offset}`)
                const res = await _request.get(request.path, cloudQuery, cloudQueryString);
                ctx.body = await normalSearchResult(qqRes, res, type)
            } else { // QQ music has not any response
                ctx.body = await _request.get(request.path, request.query, request.querystring);
            }
        } else {
            ctx.body = await _request.get(request.path, request.query, request.querystring);
        }
    }else {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

router.get('/suggest', async (ctx, next) => {
    const request = ctx.request;
    let key = request.query.keywords
    let type = '1'
    let limit = 6
    let offset = 0
    const qqQuery = { // 歌曲建议单独请求
        key: key,
        type: searchTypeMap.get(type),
        pageSize: Math.floor(limit / 2), // search limits need to average
        pageNo: Math.floor(Math.floor(offset / 2) / Math.floor(limit / 2)) + 1
    }
    const qqQueryString = encodeURI(`key=${key}&type=${qqQuery.type}&pageSize=${qqQuery.pageSize}&pageNo=${qqQuery.pageNo}`)
    const qqRes = await _requestToQQ.get('/search', qqQuery, qqQueryString);
    const qqQuery2 = {
        key: key,
    }
    const qqRestRes = await _requestToQQ.get('/search/quick', qqQuery2, encodeURI(`key=${key}`));
    if(qqRes.result == 100 || qqRestRes.result == 100) {
        const res = await _request.get(request.path, request.query, request.querystring);
        ctx.body = await normalSearchSuggestResult(qqRes, res, qqRestRes)
    } else { // QQ music has not any response
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    }
})

module.exports = router