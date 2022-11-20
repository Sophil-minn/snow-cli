'use strict';

// 判断是否为 object对象 
function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}


module.exports = {
  isObject
};