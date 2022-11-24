'use strict';
const log = require('@snowlepoard520/log');
const Command = require('@snowlepoard520/command');

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    console.log('this.projectName: ', this.projectName);
    this.force = !!this._cmd.force;
    console.log(' this.force: ',  this.force);
  }
  exec() {
    console.log('init 的业务逻辑');
  }
}

function init(argv) {
  // log.info('argv: ', argv);
  // 环境变量 存取targetPath
  log.success('通过环境变量获取targetPath: ', process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;

module.exports.InitCommand = InitCommand;
