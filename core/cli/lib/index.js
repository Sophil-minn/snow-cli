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
const init = require('@snowlepoard520/init');
const exec = require('@snowlepoard520/exec');
const constant = require('./const');
const dotenv = require('dotenv');

// console.log(colors.red('这是一段红色的文字'))

const commander = require('commander');

let args;
// 改变log.level方案一,不推荐
// checkInputArgs();
// const log = require('@snowlepoard520/log');
// 实例化一个commnader
const program = new commander.Command();

function registerCommand() {
  console.log('registerCommand: ', 1);
  // console.log('pkg?.bin: ', pkg);
  program
    .name(`${Object.keys(pkg?.bin)[0]}----minnnn`)
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false)
    .option('-tp, --targetPath <targetPath>', '是否指定本地调试文件路径', '')

  program.on('option:debug', function() {
    // log.verbose(program.rawArgs, 999999);
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
      if(program.rawArgs?.length < 4) {
        program.outputHelp();
      }
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose('test', 'program.on');
  });

  program.on('option:targetPath', function () {
    log.warn(colors.red('监听targetPath属性的输入--------'))
    log.warn(colors.red('targetPath: ', program.targetPath));
    process.env.CLI_TARGET_PATH = program.targetPath;
  });


  // 对未知命令监听
  program.on('command:*', function(obj) {
    const avaiableCommands = program.commands.map(cmd => cmd.name());
    console.log(colors.red('未知的命令：' + obj[0]));
    if(avaiableCommands.length) {
      console.log(colors.red('可用命令：' + avaiableCommands.join(',')));
    }
  });
  // 没有输入命令时,打印帮助文档
  if(process.argv.length < 3) {
    program.outputHelp();
    console.log();
  } 

  // console.log(program, 567890);
  program 
    .command('init [projectName]')
    .option('-f, --force', '是否 强制初始化项目', false)
  .action(exec)
  // .action((projectName, cmdObj) => {
  //   console.log('init', projectName, cmdObj);
  // })
  // program.parse(process.argv) 表示对传入 Node.js 的命令行参数进行解析。
  // 其中 process.argv 是 Node.js 进程接受到的原始的参数。
  console.log('registerCommand: ', 0);
  program.parse(process.argv);
}

async function core() {
  try {
    log.prepare('命令执行流程准备阶段-----------start ~ ');
    await prepare();
    log.prepare('命令执行流程准备阶段-----------end ~ ');
    log.command('命令注册阶段 start ~ ');
    registerCommand();
    log.command('命令命令阶段 end ~ ');
  } catch (e) {
    console.log('core/cli/lib/index.js 捕获的异常');
    log.error(e);
  } 
  
  log.success('success! ');
  // log.success2('success2! ');
  log.end(colors.green('脚手架命令 ---- 执行结束! '));
}


async function prepare() {
  // 检查版本号
  checkPkgVersion();
  // 检查node版本
  checkNodeVersion();
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
  // await checkGlobalUpdate();
}

// 检查版本号
function checkPkgVersion() {
  // TODO
  log.verbose( '版本号 ：', pkg.version);
  log.success('检查版本号: ', pkg.version);
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
  log.success('检查node版本', process.version);
}

function checkRoot() {
  log.verbose('登陆者何人?', process.geteuid())
  rootCheck(); // root 降级
  log.verbose('降级后,登陆者何人?', process.geteuid())
  log.success('检查root启动,并进行用户权限降级');
}

// function checkInputArgs() {
//   const minimist = require('minimist');
//   args = minimist(process.argv.slice(2));
//   log.verbose('args: ', args);
//   checkArgs();
//   log.success('检查入参', args)
// }

// function checkArgs() {
//   if (args.debug) {
//     process.env.LOG_LEVEL = 'verbose';
//   } else {
//     process.env.LOG_LEVEL = 'info';
//   }
//   // 改变log.level方案二,推荐
//   log.level =  process.env.LOG_LEVEL;
// }

function checkUserHome() {
  log.success('检查用户主目录: ', userHome);
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登陆用户主目录不存在！'))
  }
}

function checkEnv() {
  const dotenvPath = path.resolve(userHome, '.env');
  // log.verbose('dotenvPath: ', dotenvPath);
  if (pathExists(dotenvPath)) {
    dotenv.config({path: dotenvPath});
  }
  log.success('检查环境变量: ');
  createDefaultConfig();
  // log.verbose('环境变量: ', config, process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME);
    log.success('通过配置文件拿到环境变量: ', process.env.CLI_HOME);
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME);
    log.success('默认环境变量: ', constant.DEFAULT_CLI_HOME);
  }
  // 赋值给环境变量
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  return cliConfig;
}

async function checkGlobalUpdate() {
  log.success('检查是否为最新版本, 进行全局更新');
  const { getNpmInfo } = require('@snowlepoard520/get-npm-info');
  //1. 获取当前版本和模块
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // const testNpmName = '@snowlepoard520/core'
  const testNpmName2 = '@imooc-cli/core'
  log.warn('正在调用npm API, 获取包信息 ...  稍等');
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
  log.warn('获取最新的版本号...  稍等');
  const lastVersion = await getNpmLatestVersion(npmName);
  log.success('npm最新的版本号: ', lastVersion);
  log.success('当前开发版本号: ', currentVersion);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(colors.yellow(`请手动更新${npmName}, 当前版本：${currentVersion} ， 最新版本： ${lastVersion}
    更新命令： npm install -g ${npmName}
    `));
  } else {
    log.warn('当前版本号开发中... 待发布', );
  }



  
}
