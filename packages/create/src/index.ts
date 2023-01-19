#!/usr/bin/env node
import path from 'node:path';

import minimist from 'minimist';

import { createCacheDir } from './utils/cache';
import { copyModel } from './utils/copyModel';
import { getGitProjectName } from './utils/getGitProjectName';

const CACHE_PATH = './node_modules/.whim';
const cachePath = path.resolve(process.cwd(), CACHE_PATH);

async function init() {
  const {
    app: modelRoomAppName,
    _: localAppName,
    git: gitUrl,
  } = minimist(process.argv.slice(2), {
    string: ['_'],
  });

  if (!gitUrl) {
    console.log('缺少目标仓库');
    return;
  }
  if (!modelRoomAppName) {
    console.log('缺少目标模板参数');
    return;
  }
  if (!localAppName || localAppName.length === 0) {
    console.log('缺少本地要存入的位置');
    return;
  }

  const projectName = getGitProjectName(gitUrl);
  const modelDir = path.join(cachePath, projectName, 'example', modelRoomAppName);
  const targetDir = path.join(process.cwd(), `./src/${localAppName}`);

  await createCacheDir(gitUrl, cachePath);
  await copyModel(modelDir, targetDir);
}

init().catch((e) => {
  console.error(e);
});
