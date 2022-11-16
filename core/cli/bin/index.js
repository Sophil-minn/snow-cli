#! /usr/bin/env node

const colors = require('colors/safe')
// const utils = require('@snowlepoard520/utils');
const log = require('@snowlepoard520/log');

const importLocal = require('import-local');
// console.log('time: ', new Date().getDate());
log.success(colors.blue('欢迎使用snow-cli脚手架 - Just to Go!'));
if (importLocal(__filename)) {
  log.info('cli', '正在使用 snow-cli 本地版本 +++++++++++++')
} else {
  // console.log(77777)
  log.info('cli', '正在使用 snow-cli 当前版本 ----------- ')
  require('../lib')(process.argv.slice(2));
}

console.log('today is:', (new Date() + '').slice(0, 10))

// require('../lib')(process.argv.slice(2));
