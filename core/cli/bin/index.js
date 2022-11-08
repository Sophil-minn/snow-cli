#! /usr/bin/env node

// const utils = require('@snowlepoard520/utils');

// console.log('core++++++', utils, 1111);
// utils();

// function core() {
//   console.log('core', 1111);
// }

// module.exports = core;

// const importLocal = require('import-local');

// console.log('__filename: ', __filename);

if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用 snow-cli 本地版本')
} else {
  // console.log(77777)
  require('../lib')(process.argv.slice(2));
}

console.log('today is:', '11/08')

// require('../lib')(process.argv.slice(2));