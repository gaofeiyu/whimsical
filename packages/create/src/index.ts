#!/usr/bin/env node
import path from 'node:path';

import minimist from 'minimist';
import prompts from 'prompts';

import { createCacheDir } from './utils/cache';
import { copyModel } from './utils/copyModel';
import { getGitProjectName } from './utils/getGitProjectName';

const CACHE_PATH = './node_modules/.whim';
const cachePath = path.resolve(process.cwd(), CACHE_PATH);

async function init() {
  const argv = minimist(process.argv.slice(2), {
    string: ['_'],
  });
  const questions = [
    {
      type: argv._ && argv._.length > 0 ? null : 'text',
      name: 'localAppName',
      message: 'What is your localAppName?',
    },
    {
      type: argv.git ? null : 'text',
      name: 'gitUrl',
      message: 'What is your gitUrl?',
    },
    {
      type: argv.app ? null : 'text',
      name: 'modelRoomAppName',
      message: 'What is your modelRoomAppName?',
    },
  ];
  const promptsParams = await prompts(questions);
  const params = {
    localAppName: argv._,
    gitUrl: argv.git,
    modelRoomAppName: argv.app,
    ...promptsParams,
  };
  const projectName = getGitProjectName(params.gitUrl);
  const modelDir = path.join(cachePath, projectName, 'example', params.modelRoomAppName);
  const targetDir = path.join(process.cwd(), `./src/${params.localAppName}`);

  await createCacheDir(params.gitUrl, cachePath);
  await copyModel(modelDir, targetDir);
}

init().catch((e) => {
  console.error(e);
});
