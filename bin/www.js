const http = require('http');
const login = require('../login/login');

const PORT = 8000;
const HOST = '0.0.0.0'

var app = require('../app');

login();

app.listen(PORT, HOST);

