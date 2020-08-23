

function mergeLyricAndTrans(lyric, trans) {
    const lyricArr = lyric.split('\n')
    const transArr = trans.split('\n')
    const mergedLyric = ''
    for(let i = 0; i < lyricArr.length; i++) {
        mergedLyric = mergedLyric.concat(lyricArr[i], '\n', transArr[i], '\n')
    }
    return mergedLyric

}

module.exports = mergeLyricAndTrans