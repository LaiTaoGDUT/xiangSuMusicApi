const getQQSongBetch = require('../utils/getSongsBetch');
//格式化请求得到的歌单列表
function normalSimiPlaylist (list) {
    if(!list || list.length == 0) return []
    return list.map(item => {
        return {
            name: item.dissname,
            id: item.tid,
            coverImgUrl: item.imgurl,
            playCount: item.listen_num,
            creator: {
                nickname: item.creator,
            },
            trackCount: item.song_num,
            platform: 'qq'
        }
    })
}

async function normalPlaylist(data) {
    if(!data) {
        return {
            name: '未知歌单',
            creator: {
                nickname: '未知用户',
                avatarUrl: 'https://p1.music.126.net/srjmIxgdjRlCXSjZtl2aaw==/109951163825045428.jpg',
                userId: null
            },
            createTime: Date.now(),
            subscribedCount: 0,
            shareCount: 0,
            tags: [],
            description: '',
            coverImgUrl: 'https://p1.music.126.net/srjmIxgdjRlCXSjZtl2aaw==/109951163825045428.jpg',
            trackCount: 0,
            playCount: 0,
            tracks: [],
            trackIds: []
        }
    }
    let tracks = await normalSongs(data.songlist)
    return {
        name: data.dissname,
        creator: {
            nickname: data.nickname,
            avatarUrl: data.headurl,
            userId: null,
            platform: 'qq'
        },
        createTime: data.ctime * 1000,
        subscribedCount: 0,
        shareCount: 0,
        tags: data.tags.map(tag => tag.name),
        description: data.desc,
        coverImgUrl: data.logo,
        trackCount: data.songnum,
        playCount: data.visitnum,
        tracks,
        trackIds: [],
        platform: 'qq'
    }
}

//格式化请求得到的歌曲列表
async function normalSongs (list) {
    if(!list || list.length == 0) return []
    let result = []
    let songs = await getQQSongBetch(list.map(item => item.songmid))
    for(let i = 0; i < list.length; i++) {
        let artists = list[i].singer.map(singer => {
            return {
                id: singer.mid,
                name: singer.name,
                platform: 'qq'
            }
        })
        result.push({
            name: list[i].songname,
            id: list[i].songmid,
            al: {
                id: list[i].albummid,
                name: list[i].albumname,
                picUrl: '',
                platform: 'qq'
            },
            ar: artists,
            dt: Math.floor(songs[list[i].songmid].track_info.file.size_128mp3 / 128 * 8),
            platform: 'qq',
            mv: songs[list[i].songmid].track_info.mv.vid
        })
    }
    return result
}

module.exports = {
    normalSimiPlaylist,
    normalPlaylist
}