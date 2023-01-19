import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDir = './test-dir';
const testPath = path.join(__dirname, testDir);

// 如果没有这个目录就新建一个
if(!fs.existsSync(testPath)) {
  // 异步mkdir：https://nodejs.org/docs/latest-v16.x/api/fs.html#fspromisesmkdirpath-options
  // 同步mkdirSync：https://nodejs.org/docs/latest-v16.x/api/fs.html#fsmkdirsyncpath-options
  fs.mkdirSync(testPath, {
    recursive: true
  }, (err, path) => {
    if (!err) {
      console.log('Success create dir:', path);
    } else {
      console.log('err:', err)
    }
  });
} else {
  console.log('had', testPath);
}
