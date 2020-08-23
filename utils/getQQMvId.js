const _requestToQQ = require('./requestToQQ');
async function getQQMvId(mid) {
    const query = {
        songmid: mid
    }
    const res = await _requestToQQ.get('/song', query, encodeURI(`songmid=${mid}`));
    if (res.result !== 100) {
        return false
    }
    return res.data.track_info.mv.vid
}

module.exports = getQQMvId