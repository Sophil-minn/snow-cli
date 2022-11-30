'use strict';
const log = require('@snowlepoard520/log');
const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const fse = require('fs-extra');
const Command = require('@snowlepoard520/command');
const Package = require('@snowlepoard520/package');
const userHome = require('user-home');
const { spinnerStart, sleep, execAsync } = require('@snowlepoard520/utils');

const getProjectTemplate = require('./getProjectTemplate');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

const SNOW_CLI_TARGET_DIR = '.snow-cli';


class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    console.log('this.projectName: ', this.projectName);
    this.force = !!this._cmd.force;
    log.verbose(' this.force: ',  this.force);
  }
  async exec() {
    try {
      // 1，准备阶段
      const projectInfo = await this.prepare();
      // 2、下载模板
      if (projectInfo) {
        this.projectInfo = projectInfo;
        await this.downloadTemplate();
        
      }
     
    } catch (e) {
      log.error(e.message)
    }
  }

  async downloadTemplate () {
    log.verbose('准备阶段 拿到的 projectInfo: ', this.projectInfo);
    log.verbose('模版列表: ', this.template);
    console.log(this.projectInfo, '我填写的项目信息');
    const { packageVersion: myCustomVersion } = this.projectInfo;
    const { projectTemplate } = this.projectInfo;
    const templateInfo = this.template.find(item => item.npmName === projectTemplate);
    const { npmName, version } = templateInfo;
    const targetPath = path.resolve(userHome, SNOW_CLI_TARGET_DIR, 'template');
    const storeDir = path.resolve(userHome, SNOW_CLI_TARGET_DIR, 'template', 'node_modules');
    this.templateInfo = templateInfo;
    log.verbose('templateInfo', this.templateInfo);
    const templateNpm = new Package({
      targetPath,
      storeDir,
      packageName: npmName,
      packageVersion: version,
      myCustomVersion
    });
    log.verbose(targetPath, storeDir, npmName, version, templateNpm );
    // 如果不存在直接安装npm， 如果存在直接更新
    if (!await templateNpm.exists()) {
      console.log('下载模板 start');
      const spinner = spinnerStart('正在下载模板...');
      await sleep(5000);
      try {
        await templateNpm.install();
        if (await templateNpm.exists()) {
          log.success('下载模板成功');
        }
      } catch (error) {
        console.log('下载模板出错了～');
        throw error;
      } finally {
        spinner.stop(true);
        if (await templateNpm.exists()) {
          log.success('下载模板end');
        }
      }
    } else {
      console.log('更新 start');
      const spinner = spinnerStart('正在更新模板...');
      await sleep(5000);
      try {
        await templateNpm.update();
        console.log('更新模板start～');
        spinner.stop(true);
      } catch (error) {
        throw error;
      } finally {
        spinner.stop(true);
      if (await templateNpm.exists()) {
        log.success('更新模板成功');
      }
      console.log('更新 end');
      }
    }
    
  }

  async prepare() {
    console.log('start安装模板准备阶段开始~');
    // 1，通过项目模板API获取项目模板信息
    // 1.1， 通过egg.js搭建一套后端系统
    // 1.2 通过npm 存储项目模板
    // 1.3 将项目模板存储到mongodb数据库中
    // 1.4 通过egg.js获取mongodb中的数据 并且通过API返回
    // 判断项目模板是否存在
    const template = await getProjectTemplate();
    this.template = template;
    // console.log('template: ', template);
     // 1，判断当前目录是否为空
     const localPath = process.cwd();
     if (!this.isDirEmpty(localPath)) {
      let ifContinue = false;
      // console.log(this.force, 'this.force');
      if (!this.force) {
        // 询问是否继续创建
        ifContinue = (await inquirer.prompt({
          type: 'confirm',
          name: 'ifContinue',
          // default: false,
          message: '当前文件夹不为空，是否继续创建项目？'
        })).ifContinue;
        log.verbose('ifContinue: ', ifContinue);
        // 用户选否 直接终止流程
        if (!ifContinue) {
          return;
        }
      }
      // 2. 是否启动强制更新
      if (ifContinue || this.force) {
        // 给用户做二次确认
        const { confirmDelete } = await inquirer.prompt({
          type: 'confirm',
          name: 'confirmDelete',
          // default: false,
          message: '是否确认清空当前目录下的文件？',
        });
        if (confirmDelete) {
          // fse.removeSync();
          // 清空当前目录 emptyDirSync 和  removeSync区别,不会删除当前目录
          fse.emptyDirSync(localPath);
          console.log('您已清空当前目录 !',);
        }
      }
    }
    console.log('安装模板准备阶段结束~');
    // 3, 选择创建项目或组件
    // 4、获取项目的基本信息
    // return 项目的基本信息
    return this.getProjectInfo();
    // throw new Error('prepare 准备阶段 -- 出错了');
  }

  async getProjectInfo() {
    function isValidName(v) {
      return /^(@[a-zA-Z0-9-_]+\/)?[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(v);
    }
    let projectInfo = {};
    let isProjectNameValid = false;
    if (isValidName(this.projectName)) {
      isProjectNameValid = true;
      projectInfo.projectName = this.projectName;
    }
    // 1、选择创建项目或组件
    const { type } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: '请选择初始化类型',
      default: TYPE_PROJECT,
      choices: [{
        name: '项目',
        value: TYPE_PROJECT,
      }, {
        name: '组件',
        value: TYPE_COMPONENT,
      }],
    });
    const projectPrompt = [];

    // console.log('type: ', type);
    if (type === TYPE_PROJECT) {
      projectPrompt.push(
        {
          type: 'input',
          name: 'ProjectName',
          message: "请输入项目名称",
          default: '',
          validate: function(v) {
            const done = this.async();
            setTimeout(function() {
              // 1.首字符必须为英文字符
              // 2.尾字符必须为英文或数字，不能为字符
              // 3.字符仅允许"-_"
              if (!isValidName(v)) {
                done(`请输入合法的项目名称`);
                return;
              }
              done(null, true);
            }, 0);
          },
          filter: function(v) {
            return v;
          },
        }, 
        {
          type: 'input',
          name: 'ProjectVersion',
          message: "请输入项目版本号",
          default: '1.0.0',
          // validate: function(v) {
          //   return typeof v === 'string';
          // },
          // filter: function(v) {
          //   return v;
          // }
        },
        {
          type: 'list',
          name: 'projectTemplate',
          message: `请选择模板`,
          choices: this.createTemplateChoice(),
        }
      );
    } else if (type === TYPE_COMPONENT) {
      const descriptionPrompt = {
        type: 'input',
        name: 'componentDescription',
        message: '请输入组件描述信息',
        default: '',
        validate: function(v) {
          const done = this.async();
          setTimeout(function() {
            if (!(!!semver.valid(v))) {
              done('请输入合法的版本号');
              return;
            }
            done(null, true);
          }, 0);
        },
        filter: function(v) {
          if (!!semver.valid(v)) {
            return semver.valid(v);
          } else {
            return v;
          }
        },
      };
      projectPrompt.push(descriptionPrompt);
    }
    //  2. 获取组件的基本信息
    const component = await inquirer.prompt(projectPrompt);
    
    projectInfo = {
      ...projectInfo,
      type,
      ...component,
    };
     // 给用户输出 项目的基本 信息
     return projectInfo;
     
  }

  isDirEmpty(localPath) {
    log.verbose('localPath: ', localPath);
    log.verbose("path.resolve('.')", path.resolve('.'));
    log.verbose(__dirname, '__dirname');
   
    let fileList = fs.readdirSync(localPath);
    log.verbose('fileList: ', fileList);
    // 文件过滤的逻辑
    fileList = fileList.filter(file => (
      !file.startsWith('.') && ['node_modules'].indexOf(file) < 0
    ));
    return !fileList || fileList.length <= 0;
  }

  createTemplateChoice() {
    return this.template?.map(item => ({
      value: item.npmName,
      name: item.name,
    }));
  }

}

function init(argv) {
  // log.info('argv: ', argv);
  // 环境变量 存取targetPath
  log.snow('通过环境变量获取targetPath: ', process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;

module.exports.InitCommand = InitCommand;
