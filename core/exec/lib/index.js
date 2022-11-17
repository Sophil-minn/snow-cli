'use strict';

module.exports = exec;

function exec() {
  console.log('exec: ', 123456);
  console.log('exec: ', process.env.CLI_HOME_PATH);
    // TODO
}
