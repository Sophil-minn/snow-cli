#! /usr/bin/env node

const colors = require('colors/safe')
const importLocal = require('import-local');

// console.log('time: ', new Date().getDate());
console.log(colors.bgBlack(colors.rainbow('welcome to snow-cli  -  snow lepoard Just to Run!')));
console.log(colors.brightGreen('contact me on github@Sophil-minn'));
console.log(colors.brightBlue('init... 请稍等'));

async function run() {
  if (importLocal(__filename)) {
    console.log(colors.bgBlack(colors.brightGreen('you are using snow-cli local version +++++++++++++')))
  } else {
    console.log(colors.bgBlack(colors.green('now using snow-cli development version ----------- ')))
    console.log('执行流程准备中..., 请稍等...');
    require('../lib')(process.argv.slice(2));
  }
  console.log('today is:', (new Date() + '').slice(0, 10))
}

run()

// require('../lib')(process.argv.slice(2));
