'use strict';

const path = require('path');

const Package = require('@snowlepoard520/package');
const log = require('@snowlepoard520/log');
const { exec: spawn } = require('@snowlepoard520/utils');

const SETTINGS = {
  'init': "@snowlepoard/init"
}

const CACHE_DIR = 'dependencies/';

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  log.verbose('targetPath: ', targetPath);
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = '';
  let pkg = '';
  log.verbose('homePath: ', homePath);
  // log.verbose('---------', arguments, '-------------');
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
    if( await pkg.exists()) {
      await pkg.update();
    } else {
      await pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion
    });
  }
  log.verbose('pkg: ', pkg.getRootFilePath());
  log.verbose('exists: ', pkg.exists());
  log.verbose('exec: ', process.env.CLI_HOME_PATH);

  const rootFile = pkg.getRootFilePath();
  if (rootFile) {
    // try {
    //   // 当前进程中调用，无法充分利用CPU资源
    // require(rootFile).call(null, Array.from(arguments));
    // console.log('Array.from(arguments): ', Array.from(arguments));
    // 改造成 在node子进程中调用，可以额外的获取更多的CPU资源， 以便获得更高的性能
      const args =  Array.from(arguments);
      const cmd = args[args.length -1];
      const o = Object.create(null);
      Object.keys(cmd).forEach(key => {
        if (cmd.hasOwnProperty(key) && 
        key !== 'parent') {
          o[key] = cmd[key];
        }
      });
      args[args.length - 1] = o;
    //   // 兼容   windows
    const code = ` require('${rootFile.replace(/\\/g, '\\\\')}').call(null, ${JSON.stringify(args)});`;
    //   // const code = ` require(${rootFile});`;
    //   // console.log(code, 'c');
    //   // win sp.spawn('cmd', ['/c', 'node, '-e', code]);
      log.verbose('child process.cwd()-----');
      const child = spawn('node', ['-e', code], {
        cwd: process.cwd(),
        stdio: 'inherit'
      });
      child.on('error', e => {
        log.error(e.message, '出错了------');
        process.exit(1);
      });
      child.on('exit', e => {
        log.verbose('命令退出：' + e );
        process.exit(e);
      });
    //   // child.stdout.on('data', function (chunk) {
    //   //   console.log('stdout', chunk.toString());
    //   // });
    //   // child.stderr.on('data', function (chunk) {
    //   //   console.log('stderr', chunk.toString());
    //   // });
    // } catch (error) {
    //   console.log(error, 'error');/*  */
    // }
  }
  
}

module.exports = exec;