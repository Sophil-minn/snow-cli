'use strict';

const semver = require('semver');
const colors = require('colors/safe')
const log = require('@snowlepoard520/log');

const LOWEST_NODE_VERSION = '12.0.0'

class Command {
  constructor(argv) {
    console.log('CommandCommandCommandCommand: ', argv);
    console.log('constructor: ', 111111);
    this._argv = argv;
    let runner = new Promise((resovle, reject) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion())
    });

  }

  checkNodeVersion() {
    // 获取当前版本号
    log.verbose(process.version, '当前node版本号');
    log.success('检查node版本', process.version);
    const currentVersion = process.version;
    const lowestVersion = LOWEST_NODE_VERSION;
    // 比对最低版本号
    if (!semver.gte(currentVersion, lowestVersion)) {
      throw new Error(colors.red(`snow-cli 需要安装v${lowestVersion}以上版本的node`));
    } else {
      log.success('当前版本号满足!');
    }

  }

  init() {
    throw new Error('init必须实现');
  }
  
  exec() {
    throw new Error('exec必须实现');
  }

}

module.exports = Command;
