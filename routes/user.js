const router = require('koa-router')()

router.prefix('/')

router.post('/login', async (ctx, next) => {
    const { username, password } = ctx.request.body;
    const data = await  login(username, password);
    if(data.username) {
        //设置session
        ctx.session.username = data.username;
        ctx.session.realname = data.realname;

        ctx.body = new SuccessModel();
        return
    }
    ctx.body = new ErrorModel('登录失败');
})