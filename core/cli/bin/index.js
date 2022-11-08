#! /usr/bin/env node

// const utils = require('@snowlepoard520/utils');

// module.exports = core;

// const importLocal = require('import-local');

if (importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用 snow-cli 本地版本')
} else {
  // console.log(77777)
  require('../lib')(process.argv.slice(2));
}

console.log('today is:', '11/08')

// require('../lib')(process.argv.slice(2));