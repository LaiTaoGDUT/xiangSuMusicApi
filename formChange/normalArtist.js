const getQQSongBetch = require('../utils/getSongsBetch');
function normalArtist(data) {
    return {
        musicSize: data.total_song,
        albumSize: data.total_album,
        mvSize: data.total_mv,
        fans: data.singer_info.fans,
        id: data.singer_info.mid,
        name: data.singer_info.name,
        img1v1Url: `http://imgcache.qq.com/music/photo/mid_singer_150/q/K/${data.singer_info.mid}.jpg`,
        briefDesc: data.singer_brief,
        followed: false,
        platform: 'qq',
    }
}

async function normalArtistSongs(list) {
    const qqSongs = []
    let tracks = await getQQSongBetch(list.map(item => item.mid))
    for(let i = 0; i < list.length; i++) {
        let song = list[i]
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
                id: song.album.mid,
                name: song.album.name,
                picUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.pmid}.jpg`,
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

function normalArtistAlbums(list) {
    const qqAlbums = []
    for(let i = 0; i < list.length; i++) {
        let album = list[i]
        const artists = []
        for(let j = 0; j < album.singers.length; j++) {
            const artist = album.singers[j]
            artists.push({
                id: artist.singer_mid,
                name: artist.singer_name,
                alia: [],
                platform: 'qq'
            })
        }
        const _album = {
            id: album.album_mid,
            name: album.album_name,
            picUrl: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${album.album_mid}.jpg`,
            artists: artists,
            publishTime: Date.parse(album.pub_time),
            platform: 'qq'
        }
        qqAlbums.push(_album)
    }
    return qqAlbums
}

function normalSimiArtists(list) {
    const qqArtists = []
    for(let i = 0; i < list.length; i++) {
        let artist = list[i]
        const _artist = {
            id: artist.mid,
            name: artist.name,
            img1v1Url: artist.pic,
            platform: 'qq'
        }
        qqArtists.push(_artist)
    }
    return qqArtists
}

function normalArtistMv(list) {
    let result = []
    for(let i = 0; i < list.length; i++) {
        let data = list[i]
        result.push({
            id: data.vid,
            name: data.title,
            artists: [{
                id: data.singer_mid,
                platform: 'qq',
                name: data.singer_name,
                img1v1Url: `http://imgcache.qq.com/music/photo/mid_singer_150/q/K/${data.singer_mid}.jpg`,
            }],
            artistName: data.singer_name,
            cover: data.pic,
            duration: 0,
            isSubscribed: false,
            shareCount: 0,
            publishTime: new Date(data.date).getTime(),
            playCount: data.listenCount,
            desc: data.desc,
            platform: 'qq'
        })
    }
    return result
}

module.exports = { normalArtist, normalArtistSongs, normalArtistAlbums, normalSimiArtists, normalArtistMv }