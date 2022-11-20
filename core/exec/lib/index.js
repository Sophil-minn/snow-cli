'use strict';

const Package = require('@snowlepoard520/package');
const log = require('@snowlepoard520/log');

const SETTINGS = {
  'init': "@snowlepoard520/init"
}

function exec() {
  const targetPath = process.env.CLI_TARGET_PATH;
  log.verbose('targetPath: ', targetPath);
  const homePath = process.env.CLI_HOME_PATH;
  log.verbose('homePath: ', homePath);
  log.verbose(arguments, '-------------');
  const cmdObj = arguments[arguments.length - 1]
  const cmdName = cmdObj.name();
  log.verbose('cmdName: ', cmdName);
  const packageName = SETTINGS[cmdName];
  const packageVersion = 'latest';
  log.verbose('packageName: ', packageName);
  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion
  });
  log.verbose('pkg: ', pkg.getRootFilePath());
  log.verbose('exec: ', 123456);
  log.verbose('exec: ', process.env.CLI_HOME_PATH);
  
}



module.exports = exec;