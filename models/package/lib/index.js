'use strict';

const pkgDir =  require('pkg-dir').sync;
const npminstall = require('npminstall');
const fse = require('fs-extra');
const path = require('path');
const { isObject, spinnerStart } = require('@snowlepoard520/utils');
const formatPath = require('@snowlepoard520/format-path');
const log = require('@snowlepoard520/log');
const { getDefaultRegistry, getNpmLatestVersion } = require('@snowlepoard520/get-npm-info');
const pathExists = require('path-exists').sync;
class Package {
  constructor(options) {
    log.verbose('options: ', options);
    // log.verbose('isObject: ', isObject(options));
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

  async prepare() {
    log.verbose('this.storeDir: ', this.storeDir);
    if (this.storeDir && !pathExists(this.storeDir)) {
      log.verbose('生成目录：');
      fse.mkdirpSync(this.storeDir);
    }
    log.verbose('this.storeDir: ', this.packageVersion);
    if (this.packageVersion === 'latest') {
      this.packageVersion = await getNpmLatestVersion(this.packageName);
    }
    // _@imooc-cli_init@1.1.3@@imooc-cli
    // packageName: imooc-cli/init version: 1.1.3
    // log.verbose(this.packageVersion, '最新的版本');
  }

  get cacheFilePath() {
    log.verbose(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`, 88888888);
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`);
  }

  getSpecificCacheFilePath(packageVersion) {
    return path.resolve(this.storeDir, `_${this.cacheFilePathPrefix}@${packageVersion}@${this.packageName}`);
  }

  // 判断当前package是否存在
  async exists() {
    // 处于缓存模式
    if (this.storeDir) {
      const spinner = spinnerStart('package存在缓存 准备中...');
      await this.prepare();
      log.verbose('prepare: ', 99999);
      spinner.stop(true);
      return pathExists(this.cacheFilePath);
    } else {
      return pathExists(this.targetPath);
    }
  }

  // 安装package
  async install() {
    const spinner = spinnerStart('安装package 准备中...');
    await this.prepare();
    spinner.stop(true);
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
  async update() {
    // log.verbose('package update');
    const spinner = spinnerStart('安装package 准备中...');
    await this.prepare();
    spinner.stop(true);
    // 1. 获取最新的npm模块版本号
    const latestPackageVersion = await getNpmLatestVersion(this.packageName);
    log.verbose('最新的版本号latestPackageVersion: ', latestPackageVersion);
    // 2. 查询最新版本号对应的路径是否存在
    const latestFilePath = this.getSpecificCacheFilePath(latestPackageVersion);
    log.verbose(latestFilePath, '最新版本号对应的路径');
    // 3. 如果不存在，则直接安装最新版本
    if (!pathExists(latestFilePath)) {
      log.verbose('我需要更新package');
      await npminstall({
        root: this.targetPath,
        storeDir: this.storeDir,
        regitry: getDefaultRegistry(true),
        pkgs: [
          { name: this.packageName, version: latestPackageVersion }
        ]
      })
      this.packageVersion = latestPackageVersion;
    } else {
      log.verbose('不需要更新，我已经是最新的了');
    }
  }

  // 获取入口文件的路径
  getRootFilePath() {
    function _getRootFile(targetPath){
      // 1、获取package.json所在目录- pkg-dir
      // log.verbose(await packageDirectory(this.targetPath));
      const dir = pkgDir(targetPath);
      log.verbose(dir, 'dir-------');
      if (dir) {
        // 2、读取package.json
        const pkgFile = require(path.resolve(dir, 'package.json'));
        // 3、寻找main/lib
        if (pkgFile && pkgFile?.main) {
          // 4、路径的兼容（macOS/windows）
          return  formatPath(path.resolve(dir, pkgFile.main));
        }
        return pkgFile;
      }
      return null;
    }
    log.verbose('this.storeDir=========: ', this.storeDir);
    // log.verbose('this.cacheFilePath: ', this.cacheFilePath);
    // 使用缓存的时候
    if (this.storeDir) {
      return _getRootFile(this.cacheFilePath);
    } 
    // 不使用缓存的时候
    else {
      return _getRootFile(this.targetPath);
    }
  }
}


module.exports = Package;
