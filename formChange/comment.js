
function normalComment(commentArr) {
    if(!commentArr) return []
    return commentArr.map(item => {
        return normalCommentItem(item)
    })
}

function normalCommentItem(item) {
    let user = {}

    user.avatarUrl = item.avatarurl
    user.nickname = item.nick
    user.userId = getUserId(item.commentid)
    user.platform = 'qq'
    let changedItem = {
        user, 
    }
    changedItem.commentId = item.commentid
    Object.assign(changedItem, getCommentContentAndReply(item))
    changedItem.time = item.time * 1000
    changedItem.likedCount = item.praisenum
    changedItem.liked = !!item.ispraise
    changedItem.platform = 'qq'
    return changedItem
}

/**
 * 从commentId中获取用户的qq号，一般是以_分割的倒数第二串数字
 */
function getUserId(commentId) {
    let arr = commentId.split('_')
    return arr[arr.length - 2]
}

/**
 * 从middlecommentcontent和rootcommentcontent中得到评论内容和评论的回复内容，并格式化成与网易云api一致的格式
 * 当middlecommentcontent存在时，评论内容是middlecommentcontent里面的内容，否则是rootcommentcontent里面的内容
 */
function getCommentContentAndReply(item) {
    let content = ''
    let beReplied = []
    if(item.middlecommentcontent && item.middlecommentcontent.length) {
        content = item.middlecommentcontent[0].subcommentcontent
        beReplied.push({
            beRepliedCommentId: item.rootcommentid,
            user: {
                userId: getUserId(item.rootcommentid),
                nickname: item.rootcommentnick.split('@')[1]
            },
            content: item.rootcommentcontent
        })
    } else {
        content = item.rootcommentcontent
    }
    return {
        content,
        beReplied
    }
}

module.exports = normalComment