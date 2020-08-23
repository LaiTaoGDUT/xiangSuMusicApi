const _requestToQQ = require('./requestToQQ');
async function getQQAlbumId(mid) {
    const query = {
        albummid: mid
    }
    const res = await _requestToQQ.get('/album', query, encodeURI(`albummid=${mid}`));
    if (res.result !== 100) {
        return false
    }
    return res.data.id
}

module.exports = getQQAlbumId