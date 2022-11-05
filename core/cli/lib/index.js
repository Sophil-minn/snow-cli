'use strict';

module.exports = core;

const pkg = require('../package-lock.json');
const log = require('@snowlepoard520/log');

function core() {
  // 检查版本号
  checkPkgVersion();
  
}

function checkPkgVersion() {
  // TODO
  console.log( '版本号 ：', pkg.version);
  log();
}