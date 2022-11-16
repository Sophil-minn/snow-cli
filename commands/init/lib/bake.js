program 
    // init 会被封装成单独的package
    .command('init [projectName]')
    .option('-f, --force', '是否 强制初始化项目', false)
    .action(init)
    // .action((projectName, cmdObj) => {
    //   console.log('init', projectName, cmdObj);
    // })
  
  program.on('option:debug', function() {
    // log.verbose('test',34567, log);
    if (program.opts().debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }
    log.level = process.env.LOG_LEVEL;
    log.verbose('test', 'program.on');
  });
  // 对未知命令监听
  program.on('command:*', function(obj) {
    const avaiableCommands = program.commands.map(cmd => cmd.name());
    console.log(colors.red('未知的命令：' + obj[0]));
    if(avaiableCommands.length) {
      console.log(colors.red('可用命令：' + avaiableCommands.join(',')));
    }
  });

  // if(process.argv.length < 3) {
  //   program.outputHelp();
  // }
  // console.log('program:12345678 ', 9999, program.options);
  const options =  program.opts();
  console.log('options: ', options);
  if( program.args &&  program.args.length < 1) {
    // console.log('program.args: ', program.args, process.argv);
    // program.outputHelp();
  }