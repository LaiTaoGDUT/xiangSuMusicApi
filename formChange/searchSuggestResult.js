const _requestToQQ = require('../utils/requestToQQ');
const getQQSongBetch = require('../utils/getSongsBetch');
// normalize qq songs response format to Netease song
async function normalSearchSuggestResult (qqRes, cloudRes, qqRestRes) {
    return _normalSongs(qqRes, cloudRes, qqRestRes)
}

async function _normalSongs (qqRes, cloudRes, qqRestRes) {
    if(!qqRes.data || !qqRestRes.data) return cloudRes
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
            _duration = _duration = Math.floor(tracks[song.songmid].track_info.file.size_128mp3 / 128 * 8)
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
            platform: 'qq'
        }
        qqSongs.push(_song)
    }
    if(Object.keys(cloudRes.result).length === 0) return {
        result: {
            songs: qqSongs,
            order: {
                0:	"songs"
            }
        },
        code: 200
    }
    let albums = _mixin(qqRestRes.data.album ? qqRestRes.data.album.itemlist.map(ele => {
                return {
                    id: ele.mid,
                    name: ele.name,
                    platform: 'qq'
                }
            }) : null, cloudRes.result.albums)
    let artists = _mixin(qqRestRes.data.singer ? qqRestRes.data.singer.itemlist.map(ele => {
        return {
            id: ele.mid,
            name: ele.name,
            platform: 'qq'
        }
    }) : null, cloudRes.result.artists)
    let result = cloudRes.result
    if(albums.length > 0) result.albums = albums
    if(artists.length > 0) result.artists = artists
    const a = {
        result: {
            ...result,
            songs: _mixin(qqSongs, cloudRes.result.songs)
        },
        code: cloudRes.code
    }
    return a
}

function _mixin (qqSongs, cloudSongs) {
    if (!cloudSongs && !qqSongs) return []
    if (!cloudSongs) return qqSongs
    if (!qqSongs) return cloudSongs
    const obj = []
    return obj.concat(cloudSongs, qqSongs)
}

module.exports = {
    normalSearchSuggestResult
}