'use strict';

const pkgDir =  require('pkg-dir').sync;
const npminstall = require('npminstall');
const path = require('path');
const { isObject } = require('@snowlepoard520/utils');
const formatPath = require('@snowlepoard520/format-path');
const { getDefaultRegistry } = require('@snowlepoard520/get-npm-info');

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
  install() {
    return npminstall({
      root: this.targetPath,
      storeDir: this.storeDir,
      regitry: getDefaultRegistry(true),
      pkgs: [
        { name: this.packageName, version: this.packageVersion }
      ]
    })
  }

  // 更新package
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {
    // 1、获取package.json所在目录- pkg-dir
    // function _getRootFile() {
      // console.log(await packageDirectory(this.targetPath));
      const dir = pkgDir(this.targetPath);
      console.log(dir, 'dir');

      if (dir) {
        // 2、读取package.json
        const pkgFile = require(path.resolve(dir, 'package.json'));
        // 3、寻找main/lib
        if (pkgFile && pkgFile?.main) {
          // 4、路径的兼容（macOS/windows）
          return formatPath(path.resolve(dir, pkgFile.main));
        }
      }
      return null;
      }
   

}


module.exports = Package;
