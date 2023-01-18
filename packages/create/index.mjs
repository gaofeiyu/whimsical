#!/usr/bin/env node
import prompts from 'prompts';
import minimist from 'minimist';

async function init() {
  console.log(process.stdout.isTTY, process.stdout.getColorDepth() > 8);

  const cwd = process.cwd();
  const {
    app: modelRoomAppName,
    _: localAppName,
    git: gitUrl,
  } = minimist(process.argv.slice(2), {
    string: ['_'],
    // all arguments are treated as booleans
    boolean: true,
  });

  console.log('modelRoomAppName:', modelRoomAppName);
  console.log('localAppName:', localAppName);
  console.log('gitUrl:', gitUrl);
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
