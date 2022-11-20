'use strict';

const path = require('path');

const Package = require('@snowlepoard520/package');
const log = require('@snowlepoard520/log');

const SETTINGS = {
  'init': "@snowlepoard520/init"
}

const CACHE_DIR = 'dependencies/';

function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  log.verbose('targetPath: ', targetPath);
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = '';
  let pkg = '';
  log.verbose('homePath: ', homePath);
  log.verbose('---------', arguments, '-------------');
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name();
  log.verbose('cmdName: ', cmdName);
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';
  log.verbose('packageName: ', packageName);

  if (!targetPath) {
    // 生成缓存路径
    targetPath = path.resolve(homePath, CACHE_DIR);
    storeDir = path.resolve(targetPath, 'node_modules');
    log.verbose(targetPath, '默认的targetPath', storeDir, '缓存目录storeDir');
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion
    });
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion
    });
  }
  log.verbose('pkg: ', pkg.getRootFilePath());
  log.verbose('exec: ', pkg);
  log.verbose('exec: ', process.env.CLI_HOME_PATH);
  
}

module.exports = exec;