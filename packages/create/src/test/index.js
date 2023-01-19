import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.readdirSync(__dirname, { withFileTypes: true }).forEach(function(dirent) {
  var filePath = path.join(__dirname, dirent.name);
  console.log('path:', filePath);
  console.log('  dirent.isDirectory', dirent.isDirectory());
  console.log('  dirent.isFile', dirent.isFile());
});
