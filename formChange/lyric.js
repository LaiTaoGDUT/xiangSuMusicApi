
function normalLyric(res) {
    let lyric = res.data.lyric
    let trans = res.data.trans
    if(lyric == "[00:00:00]此歌曲为没有填词的纯音乐，请您欣赏") {
        lyric =  "[00:00.000]此歌曲为没有填词的纯音乐，请您欣赏"
    } else {
        lyric = lyric.split('[offset:0]\n')[1]
        trans = trans.split('[offset:0]\n')[1]
    }
    if(!res.data.trans) {
        return {
            "lrc": {
                "lyric" : lyric
            },
            "code":200,
            "tlyric": {
                "lyric": null
            },
            "platform": "qq"
        }
    } else {
        return {
            "lrc": {
                "lyric" : lyric
            },
            "code":200,
            "tlyric": {
                "lyric": trans
            },
            "platform": "qq"
        }
    }

}


module.exports = normalLyric