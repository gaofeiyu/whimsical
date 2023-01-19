import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 异步: https://nodejs.org/docs/latest-v16.x/api/fs.html#fsreaddirpath-options-callback
// 同步: https://nodejs.org/docs/latest-v16.x/api/fs.html#fsreaddirsyncpath-options

fs.readdirSync(__dirname, { withFileTypes: true }).forEach(function(dirent) {
  var filePath = path.join(__dirname, dirent.name);
  console.log('path:', filePath);
  console.log('  dirent.isDirectory', dirent.isDirectory());
  console.log('  dirent.isFile', dirent.isFile());
});

const testDir = './test-dir';
const testPath = path.join(__dirname, testDir);
console.log('has test-dir?', fs.existsSync(testPath));
