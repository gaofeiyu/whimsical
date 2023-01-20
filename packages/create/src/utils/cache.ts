import fs from 'node:fs';
import path from 'node:path';

import shell from 'shelljs';

import { stdout as log } from 'single-line-log';
import { getGitProjectName } from './getGitProjectName';
import { loading } from './loading';

/**
 * 缓存目录在node_modules/.whim
 * 1. 检查当前项目是否有缓存目录
 * 2. 如果没有新建一个缓存目录
 */

function gitPull() {
  return async () => {
    return shell.exec('git pull >/dev/null');
  };
}

function gitClone(git: string) {
  return async () => {
    return shell.exec(`git clone ${git} >/dev/null 2>&1`);
  };
}

/**
 * 创建模板仓库缓存
 * @param git 模板git仓库地址
 * @param cachePath 缓存目录
 */
export async function createCacheDir(git: string, cachePath: string) {
  const projectName = getGitProjectName(git);
  const cacheProjectName = path.join(cachePath, projectName);
  if (!fs.existsSync(cachePath)) {
    fs.mkdirSync(cachePath);
  }

  if (fs.existsSync(cacheProjectName)) {
    shell.cd(cacheProjectName);
    log('正在操作仓库：');
    if (git === shell.exec('git config remote.origin.url').toString().replace('\n', '')) {
      console.log();
      await loading('同步仓库最新代码', gitPull());
    }
  } else {
    shell.cd(cachePath);
    await loading('克隆模板仓库', gitClone(git));
  }
}
