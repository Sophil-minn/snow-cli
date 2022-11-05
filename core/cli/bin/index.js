#! /usr/bin/env node

const utils = require('@snowlepoard520/utils');

console.log('core++++++', utils, 1111);
utils();

function core() {
  console.log('core', 1111);
}



module.exports = core;