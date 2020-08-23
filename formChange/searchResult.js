const _requestToQQ = require('../utils/requestToQQ');
const getQQSongBetch = require('../utils/getSongsBetch');
// normalize qq songs response format to Netease song
async function normalSearchResult (qqRes, cloudRes, type) {
    type = parseInt(type)
    switch(type) {
        case 1: 
            return await _normalSongs(qqRes, cloudRes)
        case 10:
            return _normalAlbums(qqRes, cloudRes)
        case 100: 
            return _normalArtists(qqRes, cloudRes)
        case 1000: 
            return _normalPlaylists(qqRes, cloudRes)
        default: 
            return {}
    }
}

async function _normalSongs (qqRes, cloudRes) {
    if(qqRes.data.list.length == 0) return cloudRes
    const qqSongs = []
    let tracks = await getQQSongBetch(qqRes.data.list.map(item => item.songmid))
    for(let i = 0; i < qqRes.data.list.length; i++) {
        let song = qqRes.data.list[i]
        if(!song.songmid || !song.albummid) {
            continue
        }
        const artists = []
        for(let j = 0; j < song.singer.length; j++) {
            const artist = song.singer[j]
            artists.push({
                id: artist.mid,
                name: artist.name,
                alias: [],
                platform: 'qq' 
            })
        }
        let _duration
        if(song.size128 > 0) {
            _duration =  Math.floor(song.size128 / 128 * 8)
        } else {
            _duration = Math.floor(tracks[song.songmid].track_info.file.size_128mp3 / 128 * 8)
        }
        const _song = {
            id: song.songmid,
            name: song.songname,
            artists: artists,
            album: {
                id: song.albummid,
                name: song.albumname,
                artist: {},
                publishTime: song.pubtime * 1000,
                platform: 'qq'
            },
            duration: _duration,
            mv: tracks[song.songmid].track_info.mv.vid,
            platform: 'qq',
        }
        qqSongs.push(_song)
    }
    if(!cloudRes.result.songs) return {
        result: {
            songs: qqSongs,
            songCount: cloudRes.result.songCount + qqRes.data.total
        },
        code: 200
    }
    const a = {
        result: {
            songs: _mixin(qqSongs, cloudRes.result.songs),
            songCount: cloudRes.result.songCount + qqRes.data.total
        },
        code: cloudRes.code
    }
    return a
}

function _normalAlbums(qqRes, cloudRes) {
    if(qqRes.data.list.length == 0) return cloudRes
    const qqAlbums = []
    for(let i = 0; i < qqRes.data.list.length; i++) {
        let album = qqRes.data.list[i]
        if(!album.albumMID) {
            continue
        }
        const artists = []
        for(let j = 0; j < album.singer_list.length; j++) {
            const artist = album.singer_list[j]
            artists.push({
                id: artist.mid,
                name: artist.name,
                alias: [],
                platform: 'qq' 
            })
        }
        const _album = {
            id: album.albumMID,
            picUrl: album.albumPic,
            name: album.albumName,
            artists: artists,
            platform: 'qq',
        }
        qqAlbums.push(_album)
    }
    if(!cloudRes.result.albums) return {
        result: {
            albums: qqAlbums,
            albumCount: cloudRes.result.albumCount + qqRes.data.total
        },
        code: 200
    }
    const a = {
        result: {
            albums: _mixin(qqAlbums, cloudRes.result.albums),
            albumCount: cloudRes.result.albumCount + qqRes.data.total
        },
        code: cloudRes.code
    }
    return a 
}

function _normalArtists(qqRes, cloudRes) {
    console.log(qqRes.data.list.length)
    if(qqRes.data.list.length == 0) return cloudRes
    const qqArtists = []
    for(let i = 0; i < qqRes.data.list.length; i++) {
        let artist = qqRes.data.list[i]
        if(!artist.singerMID) {
            continue
        }
        const _artist = {
            id: artist.singerMID,
            img1v1Url: artist.singerPic,
            name: artist.singerName,
            albumSize: artist.albumNum,
            platform: 'qq',
        }
        qqArtists.push(_artist)
    }
    if(!cloudRes.result.artists) return {
        result: {
            artists: qqArtists,
            artistCount: cloudRes.result.artistCount + qqRes.data.total
        },
        code: 200
    }
    const a = {
        result: {
            artists: _mixin(qqArtists, cloudRes.result.artists),
            artistCount: cloudRes.result.artistCount + qqRes.data.total
        },
        code: cloudRes.code
    }
    return a 
}

function _normalPlaylists(qqRes, cloudRes) {
    if(qqRes.data.list.length == 0) return cloudRes
    const qqPlaylists = []
    for(let i = 0; i < qqRes.data.list.length; i++) {
        let playlist = qqRes.data.list[i]
        if(!playlist.dissid) {
            continue
        }
        const _playlist = {
            id: playlist.dissid,
            coverImgUrl: playlist.imgurl,
            name: playlist.dissname,
            trackCount: playlist.song_count,
            creator: {
                nickname: playlist.creator.name,
                userId: playlist.creator.qq,
                platform: 'qq'
            },
            description: playlist.introduction,
            platform: 'qq',
        }
        qqPlaylists.push(_playlist)
    }
    if(!cloudRes.result.playlists) return {
        result: {
            playlists: qqPlaylists,
            playlistCount: cloudRes.result.playlistCount + qqRes.data.total
        },
        code: 200
    }
    const a = {
        result: {
            playlists: _mixin(qqPlaylists, cloudRes.result.playlists),
            playlistCount: cloudRes.result.playlistCount + qqRes.data.total
        },
        code: cloudRes.code
    }
    return a 
}


function _mixin (qqSongs, cloudSongs) {
    const obj = []
    let i
    // almostly qq song's length are shorter then cloud song's length
    for(i = 0; i < qqSongs.length && i < cloudSongs.length; i++) {
        obj.push(cloudSongs[i])
        obj.push(qqSongs[i])
    }
    if(i < qqSongs.length) {
        return obj.concat(cloudSongs.slice(cloudSongs.length, qqSongs.length))
    } else if (i < cloudSongs.length) {
        return obj.concat(cloudSongs.slice(qqSongs.length, cloudSongs.length))
    } else {
        return obj
    }
}

module.exports = {
    normalSearchResult
}