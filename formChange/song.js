const _requestToQQ = require('../utils/requestToQQ');
const getQQAlbumAvatar = require('../utils/getQQAlbumAvatar')
const getQQSongBetch = require('../utils/getSongsBetch');
//格式化请求得到的歌曲列表
async function normalSimiSongs (list) {
    if(!list || list.length == 0) return []
    let result = []
    let songs = await getQQSongBetch(list.map(item => item.mid))
    for(let i = 0; i < list.length; i++) {
        let artists = list[i].singer.map(singer => {
            return {
                id: singer.mid,
                name: singer.name,
                platform: 'qq'
            }
        })
        let picUrl = await getQQAlbumAvatar(list[i].album.mid)
        result.push({
            name: list[i].name,
            id: list[i].mid,
            album: {
                id: list[i].album.mid,
                name: list[i].album.name,
                picUrl,
                platform: 'qq'
            },
            duration: Math.floor(songs[list[i].mid].track_info.file.size_128mp3 / 128 * 8),
            artists: artists,
            platform: 'qq'
        })
    }
    return result
}

module.exports = {
    normalSimiSongs
}