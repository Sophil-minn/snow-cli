'use strict';

const Package = require('@snowlepoard520/package');

function exec() {
  const pkg = new Package();
  console.log('pkg: ', pkg);
  console.log('exec: ', 123456);
  console.log('exec: ', process.env.CLI_HOME_PATH);
    // TODO
}



module.exports = exec;