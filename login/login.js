const { loginAccess } = require('../utils/log');
const superagent = require('superagent');
const cron = require("node-cron");

const phone = '18933247746';
const password = 'zhiyaokuaile1999';
const root_url = 'localhost:3000';
const login_url = `${root_url}/login/cellphone?phone=${phone}&password=${password}`;
const login_refresh_url = `${root_url}/login/refresh`;

async function login() {
    await superagent.get(login_url).end(function (err, response) {
        if (!err) {
            global.user_cookie = response.headers["set-cookie"];
            global.user_id = response.body.account.id;
            loginAccess(`${new Date()} -- login success`);
        } else
            loginAccess(`${new Date()} -- login error -- reason:${err}`);
    });
    scheLoginRefresh();
}

//定时刷新登录
async function scheLoginRefresh() {
    await cron.schedule("*/2 * * * *", () => {
        superagent.get(login_refresh_url).set("Cookie",global.user_cookie).end(function (err, response) {
            if (!err) {
                //do nothing
            } else
                loginAccess(`${new Date()} -- login refresh error -- reason:${err}`);
        });
    });
}

module.exports = login;