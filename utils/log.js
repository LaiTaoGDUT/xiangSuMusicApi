const fs = require('fs')
const path = require('path')

//写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}


//生成write stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', 'logs', fileName);
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    });
    return writeStream;
}

const accessWriteStream = createWriteStream('access.log');
const loginAccessWriteStream = createWriteStream('loginAccess.log');
const errorWriteStream = createWriteStream('error.log');

//提供日志的写入方法
function access(log) {
    writeLog(accessWriteStream, log);
}

function loginAccess(log) {
    writeLog(loginAccessWriteStream, log);
}

function error(log) {
    writeLog(errorWriteStream, log);
}

module.exports = {
    access,
    loginAccess,
    error
}