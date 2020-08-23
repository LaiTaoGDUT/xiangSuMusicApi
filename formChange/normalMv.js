
function normalMv(data) {
    return {
        id: data.vid,
        name: data.name,
        artists: data.singers.map(item => {
            return {
                id: item.mid,
                platform: 'qq',
                name: item.name,
                img1v1Url: item.picUrl
            }
        }),
        cover: data.cover_pic,
        duration: data.duration * 1000,
        isSubscribed: false,
        shareCount: 0,
        publishTime: data.pubdate * 1000,
        playCount: data.playcnt,
        desc: data.desc,
        platform: 'qq',
    }
}

function normalMvList(list) {
    let result = []
    for(let i = 0; i < (list.length > 10 ? 10 : list.length); i++) {
        let data = list[i]
        result.push(normalMv(data))
    }
    return result
}

module.exports = { normalMv, normalMvList }