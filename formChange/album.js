const _requestToQQ = require('../utils/requestToQQ');
const getQQSongBetch = require('../utils/getSongsBetch');
async function normalAlbum (res) {
    const songs = await _getAlbumSongs(res.data.mid, 'https:' + res.data.picUrl)
    let artists = []
    for(let i = 0; i < res.data.ar.length; i++) {
        const artist = res.data.ar[i]
        artists.push({
            name: artist.name,
            id: artist.mid,
        })
    }
    const commentNum = await _getCommentNum(res.data.id)
    return {
        songs: songs,
        code: 200,
        album: {
            description: res.data.desc,
            picUrl: 'https:' + res.data.picUrl,
            name: res.data.name,
            id: res.data.mid,
            type: '专辑',
            size: songs.length,
            company: res.data.company,
            publishTime: res.data.publishTime ? new Date(...res.data.publishTime.split('-')).getTime() : new Date().getTime(),
            artists: artists,
            artist: artists[0],
            info: {
                shareCount: 0,
                commentCount: commentNum
            },
            platform: 'qq'
        },
        platform: 'qq'
    }
}

async function _getAlbumSongs (id, picUrl) {
    let query = {
        albummid: id
    }
    const res = await _requestToQQ.get('/album/songs', query, encodeURI(`albummid=${id}`));
    return _normalSongs(res.data.list, res.data.albummid, picUrl)
}

async function _normalSongs (songs, albummid, picUrl) {
    const qqSongs = []
    let tracks = await getQQSongBetch(songs.map(item => item.mid))
    for(let i = 0; i < songs.length; i++) {
        let song = songs[i]
        const artists = []
        for(let j = 0; j < song.singer.length; j++) {
            const artist = song.singer[j]
            artists.push({
                id: artist.mid,
                name: artist.name,
                alia: [],
                platform: 'qq'
            })
        }
        let _duration
        if(song.file.size_128mp3 && song.file.size_128mp3 > 0) {
            _duration =  Math.floor(song.file.size_128mp3 / 128 * 8)
        } else {
            _duration = Math.floor(tracks[song.mid].track_info.file.size_128mp3 / 128 * 8)
        }
        const _song = {
            id: song.mid,
            name: song.name,
            ar: artists,
            subtitle: song.subtitle,
            al: {
                id: albummid,
                name: song.album.name,
                picUrl: picUrl,
                platform: 'qq'
            },
            platform: 'qq',
            pay: {
                price_track: song.pay.price_track,
                pay_status: song.pay.pay_status
            },
            duration: _duration,
            mv: song.mv.vid,
            mvid: song.mv.vid
        }
        qqSongs.push(_song)
    }
    return qqSongs
}

async function _getCommentNum (id) {
    let query = {
        id: id,
        biztype: 2
    }
    const res = await _requestToQQ.get('/comment', query, encodeURI(`id=${id}&biztype=2`));
    return res.data.comment.commenttotal
}

module.exports = normalAlbum