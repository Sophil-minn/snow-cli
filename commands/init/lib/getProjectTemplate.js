const request = require('@snowlepoard520/request');
const log = require('@snowlepoard520/log');
const colors = require('colors');

async function getTemplate () {
  let result = [];
  try {
    result = await request({
      url: '/snow/template'
    });
    log.verbose('/snow/template ------  result: ', result);
  } catch (error) {
    log.warnner(colors.brightYellow('请求http://mac.minn.snowlepoard:7001/本地api接口失败'));
    // log.warnner(colors.brightRed('启用兜底mock数据'));
    // log.warnner(colors.brightBlue('请求http://mac.minn.snowlepoard:7001/本地api接口失败'));
    log.warnner(colors.brightMagenta('重要提醒: 启用兜底mock数据'));
    // log.warnner(colors.brightCyan('请求http://mac.minn.snowlepoard:7001/本地api接口失败'));
    log.warnner(colors.brightWhite('重要⏰: 启用兜底mock数据'));
    log.warnner(colors.brightGreen('重要提醒: 启用兜底mock数据'));
    result = [{
      version: '1.0.0',
      name: 'vue标准模板',
      npmName: 'snow-cli-template-vue2',
      type: 'normal',
      installCommand: 'npm install',
      startCommnand: 'npm run serve',
      ignore: [ '**/public/**' ],
      tag: [ 'project' ]
    }]
  } 
  return result;
}

module.exports = getTemplate;