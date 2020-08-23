const _requestToQQ = require('./requestToQQ');
async function getQQSongId(mid) {
    const query = {
        songmid: mid
    }
    const res = await _requestToQQ.get('/song', query, encodeURI(`songmid=${mid}`));
    if (res.result !== 100) {
        throw new Error()
    }
    return res.data.track_info.id
}

module.exports = getQQSongId