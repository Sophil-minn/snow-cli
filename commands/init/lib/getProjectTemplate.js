const request = require('@snowlepoard520/request');
const log = require('@snowlepoard520/log');
const colors = require('colors');
const { templateList } = require('./mock');



async function getTemplate () {
  let result = [];

  try {
    result = await request({
      url: '/snow/template'
    });
    log.verbose('/snow/template ------  result: ', result);
  } catch (error) {
    log.warnner(colors.brightWhite('提示: 启用兜底mock数据'));
    log.warnner(colors.brightYellow('⏰: 请求http://mac.minn.snowlepoard:7001/本地api接口失败~'));
    // log.warnner(colors.brightRed('启用兜底mock数据'));
    // log.warnner(colors.brightBlue('请求http://mac.minn.snowlepoard:7001/本地api接口失败'));
    // log.warnner(colors.brightCyan('请求http://mac.minn.snowlepoard:7001/本地api接口失败'));
    log.warnner(colors.brightMagenta('重要提醒: 启用兜底mock数据'));
    // log.warnner(colors.brightGreen('重要提醒: 启用兜底mock数据'));
    log.verbose(colors.brightBlue('mock模版列表templateList: ', templateList));
    result = [...templateList];
  } 
  return result;
}

module.exports = getTemplate;