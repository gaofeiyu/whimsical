#!/usr/bin/env node
import prompts from 'prompts';
import minimist from 'minimist';
// const shell = require('shelljs');

// shell.pushd(__dirname);
// shell.exec(`git status`);
// shell.popd();

async function init() {
  console.log(process.stdout.isTTY, process.stdout.getColorDepth() > 8);

  const cwd = process.cwd();
  const argv = minimist(process.argv.slice(2), {
    string: ['_'],
    // all arguments are treated as booleans
    boolean: true,
  });

  console.log('argv:', argv);
  let result = {};
  try {
    result = await prompts([
      {
        name: 'hello',
        type: 'text',
        message: 'Hello:',
      },
    ]);
  } catch (e) {
    console.error(e);
  }
  console.log(result);
}

init().catch((e) => {
  console.error(e);
});
