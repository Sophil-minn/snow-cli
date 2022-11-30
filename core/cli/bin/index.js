#! /usr/bin/env node

const colors = require('colors/safe')
// const utils = require('@snowlepoard520/utils');
const log = require('@snowlepoard520/log');
const { spinnerStart, sleep } = require('@snowlepoard520/utils');

const importLocal = require('import-local');
// console.log('time: ', new Date().getDate());
log.snow(colors.bgBlack(colors.rainbow('welcome to snow-cli  -  snow lepoard Just to Run!')));
log.snow(colors.brightGreen('contact me on github@Sophil-minn'));

async function run() {
  if (importLocal(__filename)) {
    log.snow(colors.bgBlack(colors.brightGreen('you are using snow-cli local version +++++++++++++')))
  } else {
    // console.log(77777)
    log.snow(colors.bgBlack(colors.green('now using snow-cli development version ----------- ')))
    log.snow('执行流程准备中..., 请稍等...');
    require('../lib')(process.argv.slice(2));
  }
  console.log('today is:', (new Date() + '').slice(0, 10))
}

run()





// require('../lib')(process.argv.slice(2));
