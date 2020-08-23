const _requestToQQ = require('./requestToQQ');

async function getQQAlbumAvatar (mid) {
    let qqRequest = {
        albummid: mid
    }
    const res = await _requestToQQ.get('/album', qqRequest, encodeURI(`albummid=${mid}`));
    if(res.result !== 100) { // 没有专辑
        return 'https://p1.music.126.net/srjmIxgdjRlCXSjZtl2aaw==/109951163825045428.jpg'
    } else {
        return 'https:' + res.data.picUrl
    }
}

module.exports = getQQAlbumAvatar