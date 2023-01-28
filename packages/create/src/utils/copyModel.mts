import fs from 'node:fs';
import path from 'node:path';

import shell from 'shelljs';
import emoji from 'node-emoji';
import chalk from 'chalk';

import { loading } from './loading.mjs';

/**
 * 1. 判断要复制的内容是否存在，如果不存在退出
 * 2. 判断目的地是否存在，如果存在退出
 * 3. 进行复制
 */

/**
 * 复制模板到目标目录
 * @param modelDir 相对模板仓库模板所在位置
 * @param targetDir 要存到本地的目标位置
 */
export async function copyModel(modelDir: string, targetDir: string) {
  if (!fs.existsSync(modelDir)) {
    throw new Error(chalk.red(emoji.get('exclamation'), '缺少需要复制的文件夹'));
  }
  if (fs.existsSync(targetDir)) {
    throw new Error(
      chalk.red(
        emoji.get('exclamation'),
        '当前项目已有需要拷贝的文件夹，请更换文件夹或删除原有文件夹'
      )
    );
  }
  return await loading('复制相关文件到本地', async () => {
    await shell.cp('-R', modelDir, path.join(targetDir));
  });
}
