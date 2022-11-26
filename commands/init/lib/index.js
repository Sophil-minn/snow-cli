'use strict';
const log = require('@snowlepoard520/log');
const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs');
const fse = require('fs-extra');
const Command = require('@snowlepoard520/command');

const TYPE_PROJECT = 'project';
const TYPE_COMPONENT = 'component';

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || '';
    console.log('this.projectName: ', this.projectName);
    this.force = !!this._cmd.force;
    log.verbose(' this.force: ',  this.force);
  }
  async exec() {
    // console.log('execccccccccccccc');
    try {
      // 1，准备阶段
      await this.prepare();
      // 2、下载模板
      // 3、安装模板
     
    } catch (e) {
      log.error(e.message)
    }
  }

  async prepare() {
    console.log('start安装模板准备阶段开始~');
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
    let projectInfo = {};
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
    // console.log('type: ', type);
    if (type === TYPE_PROJECT) {
      const o = await inquirer.prompt([{
        type: 'input',
        name: 'ProjectName',
        message: "请输入项目名称",
        default: '',
        validate: function(v) {
          return typeof v === 'string';
        },
        // filter: function(v) {
        //   return v;
        // }
      }, {
        type: 'input',
        name: 'ProjectVersion',
        message: "请输入项目版本号",
        default: '',
        validate: function(v) {
          return typeof v === 'string';
        },
        // filter: function(v) {
        //   return v;
        // }
      }]);
      console.log(o, '用户输入的信息');
    } else if (type === TYPE_COMPONENT) {
      const descriptionPrompt = {
        type: 'input',
        name: 'componentDescription',
        message: '请输入组件描述信息',
        default: '',
        validate: function(v) {
          const done = this.async();
          setTimeout(function() {
            if (!v) {
              done('请输入组件描述信息');
              return;
            }
            done(null, true);
          }, 0);
        },
      };
      projectPrompt.push(descriptionPrompt);
      // 2. 获取组件的基本信息
      const component = await inquirer.prompt(projectPrompt);
      projectInfo = {
        ...projectInfo,
        type,
        ...component,
      };
    }
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

}

function init(argv) {
  // log.info('argv: ', argv);
  // 环境变量 存取targetPath
  log.success('通过环境变量获取targetPath: ', process.env.CLI_TARGET_PATH);
  return new InitCommand(argv);
}

module.exports = init;

module.exports.InitCommand = InitCommand;
