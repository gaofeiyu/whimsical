import fs from 'node:fs';
import path from 'node:path';

import shell from 'shelljs';
import { stdout as log } from 'single-line-log';
import { getGitProjectName } from './getGitProjectName.js';

/**
 * 缓存目录在node_modules/.whim
 * 1. 检查当前项目是否有缓存目录
 * 2. 如果没有新建一个缓存目录
 */

export async function createCacheDir(git, cachePath) {
  const projectName = getGitProjectName(git);
  const cacheProjectName = path.join(cachePath, projectName);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  if (fs.existsSync(cacheProjectName)) {
    shell.cd(cacheProjectName);
    log('正在操作仓库：');
    if (git === shell.exec('git config remote.origin.url').toString().replace('\n', '')) {
      log('正在同步仓库最新代码...');
      shell.exec('git pull >/dev/null');
      // Todo 错误处理
      log('正在同步仓库最新代码 成功');
      console.log('');
    }
  } else {
    shell.cd(cachePath);
    log('正在克隆代码...');
    shell.exec(`git clone ${git} >/dev/null`);
    // Todo 错误处理
    log('正在克隆代码 成功');
    console.log('');
  }
}
