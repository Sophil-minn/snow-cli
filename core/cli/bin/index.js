#! /usr/bin/env node

// const utils = require('@snowlepoard520/utils');
const log = require('@snowlepoard520/log');
// const log = require('npmlog');

// module.exports = core;

const importLocal = require('import-local');
console.log('__filename: ', new Date().getDate());

console.log('1.2.5');

if (importLocal(__filename)) {
  log.info('cli', '正在使用 snow-cli 本地版本')
} else {
  // console.log(77777)
  log.info('cli', '正在使用 snow-cli 开发中版本 ----- ')
  require('../lib')(process.argv.slice(2));
}

console.log('today is:', '11/08')

// require('../lib')(process.argv.slice(2));
