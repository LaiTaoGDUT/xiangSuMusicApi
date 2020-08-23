const Koa = require('koa');
const morgan = require('koa-morgan');
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const app = new Koa();

const user = require('./routes/user')
const song = require('./routes/song')
const lyric = require('./routes/lyric')
const search = require('./routes/search')
const album = require('./routes/album')
const comment = require('./routes/comment')
const simi = require('./routes/simi')
const playlist = require('./routes/playlist')
const mv = require('./routes/mv')
const artist = require('./routes/artist')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())

const ENV = process.env.NODE_ENV;
if (ENV !== 'production') {
    // 开发 / 测试 环境
    app.use(morgan('dev'));
} else {
    // 线上环境
    const logFileName = path.join(__dirname, 'logs', 'access.log');
    const writeStream = fs.createWriteStream(logFileName, {
        flags: 'a'
    })
    app.use(morgan('combined', {  //日志生成
        stream: writeStream   //写入日志文件
    }));
}



// app.use(user.routes(), user.allowedMethods())
app.use(song.routes(), song.allowedMethods())
app.use(lyric.routes(), lyric.allowedMethods())
app.use(search.routes(), search.allowedMethods())
app.use(album.routes(), album.allowedMethods())
app.use(comment.routes(), comment.allowedMethods())
app.use(simi.routes(), simi.allowedMethods())
app.use(playlist.routes(), playlist.allowedMethods())
app.use(mv.routes(), mv.allowedMethods())
app.use(artist.routes(), artist.allowedMethods())

// 没有匹配的路由
const _request = require('./utils/request');
// 请求转发
app.use(async (ctx, next) => {
    const request = ctx.request;
    if(ctx.method === 'GET') {
        ctx.body = await _request.get(request.path, request.query, request.querystring);
    } else if(ctx.method === 'POST') {
        ctx.body = await _request.post(request.path, request.query, request.querystring, request.body);
    }
})

// catch 404 and forward to error handler
// app.use(async (ctx, next) => {
//     next(createError(404));
// });

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
  });

module.exports = app;

//process.env.NODE_ENV