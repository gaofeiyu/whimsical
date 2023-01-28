import chalk from 'chalk';
import fs from 'node:fs';

import emoji from 'node-emoji';

enum INFO {
  'platform' = '平台名称',
}

/**
 * 1. 获取配置文件地址
 * 2. 解析配置文件（当前仅支持json）
 * 3. 组织shell输出样式
 * 4. 输出
 */

function infoTemplate(info) {
  // 后续有需要可以改成结构化输出
  console.log(`
${INFO.platform}：${chalk.green(info.platform)}
  `);
}

/**
 * 输出当前模板信息
 * @param path 模板配置文件地址
 */
export const outputmodelInfo = (path) => {
  if (fs.existsSync(path)) {
    try {
      const info = fs.readFileSync(path, {
        encoding: 'utf-8',
      });
      infoTemplate(JSON.parse(info));
      console.log(chalk.green(emoji.get('ok_hand'), '安装成功'));
    } catch (err) {
      throw new Error(chalk.red(emoji.get('exclamation'), '配置文件处理失败：') + chalk.red(err));
    }
  } else {
    throw new Error(chalk.yellow('success: 未找到该模板配置文件'));
  }
};
