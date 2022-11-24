'use strict';

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

module.exports = {
  isObject,
  exec
};