'use strict';

module.exports = core;

const path = require('path');
const pkg = require('../package-lock.json');
const semver = require('semver');
const colors = require('colors/safe');
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const rootCheck = require('root-check');
const log = require('@snowlepoard520/log');
const constant = require('./const');

let args;
// 改变log.level方案一,不推荐
// checkInputArgs();
// const log = require('@snowlepoard520/log');


async function core() {
  try {
    // 检查版本号
    checkPkgVersion();
    // 检查node版本
    checkNodeVersion();
    // 检查root启动,并进行用户权限降级
    checkRoot();
    // 检查用户主目录
    checkUserHome();
    // 检查入参
    checkInputArgs();
    // log.verbose('test', 'test debug log');
    // 检查环境变量
    checkEnv();
    // 检查是否为最新版本, 进行全局更新
    await checkGlobalUpdate();
  } catch (e) {
    console.log('我是铺货的错误');
    log.error(e.message);
  }
  
  
}

function checkPkgVersion() {
  // TODO
  log.verbose( '版本号 ：', pkg.version);
  // log();
}

function checkNodeVersion() {
  // 获取当前版本号
  log.verbose(process.version, '当前node版本号');
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  // 比对最低版本号
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red(`snow-cli 需要安装v${lowestVersion}以上版本的node`));
  }

}

function checkRoot() {
  log.verbose('登陆者何人?', process.geteuid())
  rootCheck(); // root 降级
  log.verbose('降级后,登陆者何人?', process.geteuid())
}

function checkInputArgs() {
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  log.verbose('args: ', args);
  checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  // 改变log.level方案二,推荐
  log.level =  process.env.LOG_LEVEL;
}

function checkUserHome() {
  log.verbose('userHome: ', userHome);
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登陆用户主目录不存在！'))
  }
}

function checkEnv() {
  const dotenv = require('dotenv');
  const dotenvPath = path.resolve(userHome, '.env');
  // log.verbose('dotenvPath: ', dotenvPath);
  if (pathExists(dotenvPath)) {
    dotenv.config({path: dotenvPath});
  }
  createDefaultConfig();
  // log.verbose('环境变量: ', config, process.env.CLI_HOME_PATH);
  // log.verbose('env: ', config, process.env);
  
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  // 赋值给环境变量
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  return cliConfig;
}

async function checkGlobalUpdate() {
  const { getNpmInfo } = require('@snowlepoard520/get-npm-info');
  //1. 获取当前版本和模块
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // const testNpmName = '@snowlepoard520/core'
  const testNpmName2 = '@imooc-cli/core'
  //2. 调用npm API, 获取包信息
  const data = await getNpmInfo(npmName);
  // console.log('data: ', data);
  // 获取所有的版本号
  const { getNpmVersions, getNpmSemverVersions, getNpmLatestVersion } = require('@snowlepoard520/get-npm-info');
  const versions = await getNpmVersions(npmName);
  // console.log(npmName, 'versions: ', versions);
  //3. 提取所有版本号，比对那些版本号是大于当前版本号
  // const semverVersions = await getNpmSemverVersions(currentVersion, testNpmName);
  // const allVersions = await getNpmVersions(npmName);
  // console.log(testNpmName2, 'allVersions: ', allVersions);
  const semverVersions = await getNpmSemverVersions(currentVersion, npmName);
  // console.log('semverVersions: ', semverVersions);

  //4. 获取最新的版本号，提示用户更新到该版本
  const lastVersion = await getNpmLatestVersion(npmName);
  console.log('lastVersion: ', lastVersion);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新${npmName}, 当前版本：${currentVersion} ， 最新版本： ${lastVersion}
    更新命令： npm install -g ${npmName}
    `));
  }
  
}
