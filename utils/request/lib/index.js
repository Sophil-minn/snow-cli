'use strict';
const axios = require('axios');
const log = require('@snowlepoard520/log');
const BASE_URL = process.env.SNOW_CLI_BASE_URL ? process.env.SNOW_CLI_BASE_URL : 'http://mac.minn.snowlepoard.error:7001';
// console.log('BASE_URL: ', BASE_URL);

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
});

// console.log('request: ', request);

request.interceptors.response.use(
  response => {
    // console.log('response: ', response);
    return response.data;
  },
  error => {
    log.verbose('request.interceptors.response. error--- ');
    return Promise.reject();
  }
);

module.exports = request;