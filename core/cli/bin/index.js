#! /usr/bin/env node

const colors = require('colors/safe')
const log = require('@snowlepoard520/log');
const importLocal = require('import-local');

// console.log('time: ', new Date().getDate());
log.verbose(colors.bgBlack(colors.rainbow('welcome to snow-cli  -  snow lepoard Just to Run!')));
log.verbose(colors.brightGreen('contact me on github@Sophil-minn'));
log.verbose(colors.brightBlue('init... 请稍等'));

async function run() {
  if (importLocal(__filename)) {
    log.verbose(colors.bgBlack(colors.brightGreen('you are using snow-cli local version +++++++++++++')))
  } else {
    log.verbose(colors.bgBlack(colors.green('now using snow-cli development version ----------- ')))
    log.verbose('执行流程准备中..., 请稍等...');
    require('../lib')(process.argv.slice(2));
  }
  log.verbose('today is:', (new Date() + '').slice(0, 10))
}

run()

// require('../lib')(process.argv.slice(2));
