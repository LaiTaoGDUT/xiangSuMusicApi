const _requestToQQ = require('./requestToQQ');
async function getQQSongBetch(mids) {
    if(mids.length > 100) {
        let songsRes = {}
        for(let i = 0; i < mids.length; i += 100) {
            let j = i + 100 > mids.length ? mids.length : i + 100
            let query = {
                songmids: mids.slice(i, j).join(',')
            }
            let songSplit = await _requestToQQ.get('/song/batch', query, encodeURI(`songmids=${query.songmids}`));
            songsRes = Object.assign({}, songsRes, songSplit.data)
        } 
        return songsRes
    }
    const query = {
        songmids: mids.join(',')
    }
    const res = await _requestToQQ.get('/song/batch', query, encodeURI(`songmids=${mids.join(',')}`));
    if (res.result !== 100) {
        return {}
    }
    return res.data
}

module.exports = getQQSongBetch