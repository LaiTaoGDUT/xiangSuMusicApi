const _requestToQQ = require('./requestToQQ');

async function getSongDuration(id) {
    let query = {
        songmid: id
    }
    const res = await _requestToQQ.get('/song', query, encodeURI(`songmid=${id}`));
    return Math.floor(res.data.track_info.file.size_128mp3 / 128 * 8)
}

module.exports = getSongDuration