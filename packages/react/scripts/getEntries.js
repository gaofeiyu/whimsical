import fg from 'fast-glob';
import path from 'path';

const genEntries = (pattern) => {
  const fileList = {};
  const entries = fg.sync(pattern, {
    onlyFiles: false,
    deep: Infinity
  });
  entries.forEach((entry) => {
    const fileOutDir = entry.replace(/\.tsx$|.ts$/g, '');
    fileList[fileOutDir] = path.resolve(__dirname, `../${entry}`);
  });
  return fileList;
};

export default genEntries;

