'use strict';
const log = require('@snowlepoard520/log');


function init(projectName, cmdObj) {
  // 环境变量 存取targetPath
  // log.info('init - projectName, targetPath: ', cmdObj.parent.targetPath);
  log.success('通过环境变量获取targetPath: ', process.env.CLI_TARGET_PATH);
    // TODO
}

module.exports = init;
