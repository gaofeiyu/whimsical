import fs from 'node:fs';
import path from 'node:path';

import { getGitProjectName } from './getGitProjectName.mjs';
import shell from 'shelljs';

/**
 * 缓存目录在node_modules/.whim
 * 1. 检查当前项目是否有缓存目录
 * 2. 如果没有新建一个缓存目录
 */

const CACHE_PATH = './node_modules/.whim';
const cachePath = path.resolve(process.cwd(), CACHE_PATH);

export function createCacheDir(git) {
  const projectName = getGitProjectName(git);
  const cacheProjectName = path.join(process.cwd(), CACHE_PATH, projectName);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  if (fs.existsSync(cacheProjectName)) {
    shell.cd(cacheProjectName);
    if (git === shell.exec('git config remote.origin.url').toString().replace('\n', '')) {
      shell.echo('正在同步仓库最新代码...');
      shell.exec('git pull');
      shell.echo('同步完成');
    }
  } else {
    shell.echo('正在克隆代码...');
    shell.cd(cachePath);
    shell.exec(`git clone ${git}`);
    shell.echo('克隆完成');
  }
}
