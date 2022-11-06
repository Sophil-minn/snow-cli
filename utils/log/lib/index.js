'use strict';


const log = require('npmlog');


log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL: 'info'; // 判断debug模式


// log.level = 'verbose';

log.heading = '日志:'; // 修改前缀
log.addLevel('success', 2000, { fg: 'green', bold: true}); // 添加 自定义命令

module.exports = log;

function index() {
  console.log('process.env.LOG_LEVEL: ', process.env.LOG_LEVEL);
  log.verbose('test', 'targetPath');
  log.info('cli', 'test');
}

