'use strict';

module.exports = core;

const path = require('path');
const pkg = require('../package.json');
const semver = require('semver');
const colors = require('colors/safe')
const userHome = require('user-home');
const pathExists = require('path-exists').sync;
const rootCheck = require('root-check');
const log = require('@snowlepoard520/log');
const exec = require('@snowlepoard520/exec');
const { getNpmLatestVersion } = require('@snowlepoard520/get-npm-info');
const constant = require('./const');
const dotenv = require('dotenv');

const commander = require('commander');
const program = new commander.Command();

function registerCommand() {
  log.verbose('registerCommand: ', 'start');
  // log.verbose('pkg?.bin: ', pkg);
  program
    .name(`${Object.keys(pkg?.bin)[0]}----minnnn`)
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')

  program.on('option:debug', function() {
    log.verbose(program.rawArgs, 'option:debug');
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
      if(program.rawArgs?.length < 4) {
        program.outputHelp();
      }
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose('debug mode');
  });

  program.on('option:targetPath', function () {
    log.verbose(colors.red('监听targetPath属性'))
    log.verbose(colors.red('targetPath: ', program.targetPath));
    process.env.CLI_TARGET_PATH = program.targetPath;
  });

  // 对未知命令监听
  program.on('command:*', function(obj) {
    const avaiableCommands = program.commands.map(cmd => cmd.name());
    log.verbose(colors.red('未知的命令：' + obj[0]));
    if(avaiableCommands.length) {
      log.verbose(colors.red('可用命令：' + avaiableCommands.join(',')));
    }
  });
  // 没有输入命令时,打印帮助文档
  if(process.argv.length < 3) {
    console.log(colors.red('⏰: 命令后面需要输入参数...'));
    // program.outputHelp();
  } 
  log.verbose(program, '没有输入命令');
  program 
    .command('init [projectName]')
    .option('-f, --force', '是否 强制初始化项目', false)
    .action(exec)
  // .action((projectName, cmdObj) => {
  //   log.verbose('init', projectName, cmdObj);
  // })
  // program.parse(process.argv) 表示对传入 Node.js 的命令行参数进行解析。
  // 其中 process.argv 是 Node.js 进程接受到的原始的参数。
  log.verbose('registerCommand: ', 'end');
  program.parse(process.argv);
}

async function core() {
  try {
    await prepare();
    registerCommand();
  } catch (e) {
    log.verbose('core/cli/lib/index.js 捕获的异常');
    log.error(e);
  } 
  log.verbose('core end...! ');
}


async function prepare() {
  log.verbose('准备阶段-----------start ~ ');
  // 检查版本号
  checkPkgVersion();
  // 检查node版本 下沉到command里去
  // checkNodeVersion();
  // 检查root启动,并进行用户权限降级
  checkRoot();
  // 检查用户主目录
  checkUserHome();
  // 检查入参
  // checkInputArgs();
  // log.verbose('test', 'test debug log');
  // 检查环境变量
  checkEnv();
  // 检查是否为最新版本, 进行全局更新
  await checkGlobalUpdate();
  log.verbose('准备阶段-----------end ~ ');
}

// 检查版本号
function checkPkgVersion() {
  log.verbose('当前版本: ',pkg.name, pkg.version);
}

// 下沉到command中去
// function checkNodeVersion() {
//   // 获取当前版本号
//   log.verbose(process.version, '当前node版本号');
//   const currentVersion = process.version;
//   const lowestVersion = constant.LOWEST_NODE_VERSION;
//   // 比对最低版本号
//   if (!semver.gte(currentVersion, lowestVersion)) {
//     throw new Error(colors.red(`snow-cli 需要安装v${lowestVersion}以上版本的node`));
//   }
//   log.snow('检查node版本', process.version);
// }

function checkRoot() {
  log.verbose('登陆者何人?', process.geteuid())
  rootCheck(); // root 降级
  log.verbose('降级后,登陆者何人?', process.geteuid())
  log.verbose('检查是否root启动,并进行用户权限降级');
}

function checkUserHome() {
  log.verbose('检测到的用户主目录: ', userHome);
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登陆用户主目录不存在！'))
  }
}

function checkEnv() {
  log.verbose('检查环境变量: ');
  const dotenvPath = path.resolve(userHome, '.env');
  log.verbose('dotenvPath: ', dotenvPath);
  if (pathExists(dotenvPath)) {
    dotenv.config({ path: dotenvPath });
  }
  // 生成环境配置
  createDefaultConfig();
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    log.verbose('通过配置文件拿到环境变量: ', process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    log.verbose('使用默认环境变量: ', constant.DEFAULT_CLI_HOME);
  }
  // 赋值给环境变量
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  return cliConfig;
}

async function checkGlobalUpdate() {
  log.verbose('检查是否为最新版本, 如果否则进行全局更新');
  //1. 获取当前版本和模块
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // const testNpmName = '@snowlepoard520/core'
  // 获取最新的版本号，提示用户更新到该版本
  log.verbose(`获取${npmName}最新的版本号...  稍等`);
  const lastVersion = await getNpmLatestVersion(npmName);
  log.verbose('npm最新的版本号: ', lastVersion);
  log.verbose('当前开发版本号: ', currentVersion);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新${npmName}, 当前版本：${currentVersion} ， 最新版本： ${lastVersion}
    更新命令： npm install -g ${npmName}
    `));
  } else {
    log.verbose('当前版本不需要更新', );
  }
}
