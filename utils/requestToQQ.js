const superagent = require('superagent');
const { access, error } = require('../utils/log');

const host = 'localhost:3300';
async function get(path, query, querystring) {
    let _url;
    if(query.me) {
        _url = `${host}${path}?${querystring.replace('me=true','uid='+global.user_id)}`
    } else {
        _url = `${host}${path}?${querystring}`
    }
    const res = await new Promise((resolve, reject) => {
        superagent.get(_url).end(function (err, res) {
            if (!err) {
                access(`${_url} -- ${new Date()}}`);
                resolve(res.body);
            } else {
                error(`${_url} -- ${new Date()} -- ${err}`);
                reject(err);
            }
        });
    })
    return res;
}

async function post(path, query, querystring, body) {
    let _url;
    if(query.me) {
        _url = `${host}${path}?${querystring.replace('me=true','uid='+global.user_id)}`
    } else {
        _url = `${host}${path}?${querystring}`
    }
    const res = await new Promise((resolve, reject) => {
        superagent.post(_url).send(body).end(function (err, res) {
            if (!err) {
                access(`${_url} -- ${new Date()}}`);
                resolve(res.body);
            } else {
                error(`${_url} -- ${new Date()} -- ${err}`);
                reject(err);
            }
        });
    })
    return res;
}

module.exports = {
    get,
    post
}