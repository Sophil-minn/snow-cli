'use strict';

const { isObject } = require('@snowlepoard520/utils');

class Package {
  constructor(options) {
    // console.log('isObject: ', isObject(options));
    // console.log('Package constructor')
    if (!options) {
      throw new Error('package 参数不能为空');
    }
    if (!isObject(options)) {
      throw new Error('package类 options参数必须为对象');
    }
    // package的目标路径
    this.targetPath = options.targetPath;
    // package的缓存路径
    this.storeDir = options.storeDir;
    // package的存储路径
    // this.storePath = options.storePath;
    // package的name
    this.packageName = options.packageName;
    // package的version
    this.packageVersion = options.packageVersion;
    // console.log('初始化 package constructor');
    // package的缓存目录前缀
    this.cacheFilePathPrefix = this.packageName.replace('/', '_');
  }

  // 判断当前package是否存在
  exists() {}

  // 安装package
  install() {}

  // 更新package
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {}


}


module.exports = Package;
