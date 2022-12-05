'use strict';

const Spinner = require('cli-spinner').Spinner;

// 判断是否为 object对象 
function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function exec (command, args, options) {
  //兼容windows系统
  const win32 = process.platform === 'win32';
  const cmd = win32 ? 'cmd': command;
  const cmdArgs = win32 ? ['/c'].concat(command, args) : args;
  return require('child_process').spawn(cmd, cmdArgs, options || {});
}

function spinnerStart(msg, spinnerString = '|/-\\') {
  const spinner = new Spinner(msg + ' %s');
  spinner.setSpinnerString(spinnerString);
  spinner.start();
  return spinner;
}

function sleep(timeout = 2000) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function execAsync(command, args, options) {
  return new Promise((resolve, reject) => {
    const p = exec(command, args, options);
    p.on('error', e => {
      reject(e);
    });
    p.on('exit', c => {
      resolve(c);
    });
  });
}

module.exports = {
  isObject,
  spinnerStart,
  execAsync,
  sleep,
  exec
};