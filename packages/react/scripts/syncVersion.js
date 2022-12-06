const fs = require('fs');
const path = require('path');
const { version } = require('../package.json');



const output = (str) => {
  fs.writeFile(path.resolve('./packages/src/version.ts'), str, err => {
    if (err) {
      console.error(err);
    }
  });
}
output(`export const version = '${version}';
`);
