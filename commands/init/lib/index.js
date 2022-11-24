'use strict';
const log = require('@snowlepoard520/log');
const Command = require('@snowlepoard520/command');

class InitCommand extends Command {

}


function init(argv) {
  // log.info('argv: ', argv);
  // 环境变量 存取targetPath
  log.success('通过环境变量获取targetPath: ', process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;

module.exports.InitCommand = InitCommand;
