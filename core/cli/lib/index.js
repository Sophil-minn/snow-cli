'use strict';

module.exports = core;

const pkg = require('../package-lock.json');
const log = require('@snowlepoard520/log');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const rootCheck = require('root-check');

const constant = require('./const');

function core() {
  try {
    // 检查版本号
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
  } catch (e) {
    console.log('我是铺货的错误');
    log.error(e.message);
  }
  
  
}

function checkPkgVersion() {
  // TODO
  console.log( '版本号 ：', pkg.version);
  // log();
}

function checkNodeVersion() {
  // 获取当前版本号
  console.log(process.version, '当前node版本号');
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  // 比对最低版本号
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`snow-cli 需要安装v${lowestVersion}以上版本的node`));
  }

}

function checkRoot() {
  console.log('登陆者何人?', process.geteuid())
  rootCheck(); // root 降级
  console.log('降级后,登陆者何人?', process.geteuid())
}

function checkUserHome() {
  console.log('userHome: ', userHome);
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登陆用户主目录不存在！'))
  }
}