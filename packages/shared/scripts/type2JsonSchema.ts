import { resolve } from 'path';

import * as TJS from 'typescript-json-schema';
import { Args } from 'typescript-json-schema';

const __dirname = resolve();
const tsconfigDIR = resolve(__dirname, './tsconfig.type.json');
const schemaOutDIR = resolve(__dirname, './dist/schema.json');

const settings: Args = {
  ...TJS.getDefaultArgs(),
  ...{
    out: schemaOutDIR
  }
};

TJS.exec(
  resolve(__dirname, tsconfigDIR),
  '*',
  settings
);

