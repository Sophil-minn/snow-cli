'use strict';


const log = require('npmlog');


log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL: 'info'; // 判断debug模式


// log.level = 'verbose';

log.heading = 'snow:'; // 修改前缀
log.addLevel('success', 2400, { fg: 'green'}); // 添加 自定义命令
// log.addLevel('success2', 2300, { fg: 'coffee'}); // 添加 自定义命令
log.addLevel('prepare', 2200, { fg: 'cyan'}); // 添加 自定义命令
log.addLevel('command', 2100, { fg: 'yellow'}); // 添加 自定义命令
log.addLevel('end', 5200, { fg: 'cyan', bg: "blue", bold: true}); // 添加 自定义命令

module.exports = log;

function index() {
  console.log('process.env.LOG_LEVEL: ', process.env.LOG_LEVEL);
  log.verbose('test', 'targetPath');
  log.info('cli', 'test');
}

