#!/usr/bin/env node
import * as fs from 'node:fs';
import * as path from 'node:path';

import prompts from 'prompts';

async function init() {
  let result = {};
  try {
    result = await prompts([
      {
        name: 'hello',
        type: 'text',
        message: 'Hello:',
      },
    ]);
  } catch (e) {
    console.error(e);
  }
  console.log(result);
}

init().catch((e) => {
  console.error(e);
});
