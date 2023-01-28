#!/usr/bin/env node
import path from 'node:path';

import minimist from 'minimist';
import inquirer from 'inquirer';

import { CACHE_PATH, MODEL_BASE_PATH, LOCAL_BASE_PATH, CONFIG__FILE } from './config.mjs';
import { createCacheDir } from './utils/cache.mjs';
import { copyModel } from './utils/copyModel.mjs';
import { getGitProjectName } from './utils/getGitProjectName.mjs';
import { outputmodelInfo } from './utils/outputInfo.mjs';

const cachePath = path.resolve(process.cwd(), CACHE_PATH);

async function init() {
  const argv = minimist(process.argv.slice(2), {
    string: ['_'],
  });
  const localAppName = argv._ && argv._.length > 0 ? argv._[0] : undefined;
  const questions = [
    {
      type: 'text',
      name: 'localAppName',
      message: 'What is your localAppName?',
      when: !localAppName,
    },
    {
      type: 'text',
      name: 'gitUrl',
      message: 'What is your gitUrl?',
      when: !argv.git,
    },
    {
      type: 'text',
      name: 'modelAppName',
      message: 'What is your modelAppName?',
      when: !argv.app,
    },
  ];
  const promptsParams = await inquirer.prompt(questions);
  const params = {
    localAppName,
    gitUrl: argv.git,
    modelAppName: argv.app,
    ...promptsParams,
  };
  const projectName = getGitProjectName(params.gitUrl);
  const modelDir = path.join(cachePath, projectName, MODEL_BASE_PATH, params.modelAppName);
  const targetDir = path.join(process.cwd(), LOCAL_BASE_PATH, params.localAppName);
  const modelInfoFilePath = path.join(targetDir, CONFIG__FILE);
  try {
    await createCacheDir(params.gitUrl, cachePath);
    await copyModel(modelDir, targetDir);
    await outputmodelInfo(modelInfoFilePath);
  } catch (err) {
    console.log(err.message);
  }
}

init().catch((err) => {
  console.error(err);
});
