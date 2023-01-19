import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDir = './test-dir';
const testPath = path.join(__dirname, testDir);

// rmdir的recursive属性将要废弃，不推荐
// if(fs.existsSync(testPath)) {
//   fs.rmdir(testPath, {
//     recursive: true
//   }, (err) => {
//     if (err) {
//       console.log('err:', err)
//     }
//   });
// } else {
//   console.log('haven\'t', testPath);
// }

if(fs.existsSync(testPath)) {
  //异步: https://nodejs.org/docs/latest-v16.x/api/fs.html#fsrmpath-options-callback
  //同步: https://nodejs.org/docs/latest-v16.x/api/fs.html#fsrmsyncpath-options
  fs.rmSync(testPath, {
    force: true,
    recursive: true
  }, (err) => {
    if (err) {
      console.log('err:', err)
    }
  });
} else {
  console.log('haven\'t', testPath);
}
