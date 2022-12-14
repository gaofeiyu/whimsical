import fs from 'fs';
import path from 'path';

const DEEP = 4;
const BREADTH = 10;

export const fullTreeCreator = (options) => {
  const { deep = 1, breadth = 1, id = 'Root', createNode = () => null } = options;
  const result = {
    id,
    children: [],
    value: createNode(id),
    name: 'View'
  };
  if (deep > 0){
    for (let b = 0; b < breadth; b++) {
      const nodeId = `node-d${deep - 1}-b${b}`;
      result.children.push(fullTreeCreator({
        ...options,
        id: nodeId,
        deep: deep - 1,
      }));
    }

  }
  return result;
};

export const fullJSXStringCreator = (options) => {
  const { deep = 1, breadth = 1, id = 'Root' } = options;
  let result = '';
  if (deep > 0){
    for (let b = 0; b < breadth; b++) {
      const nodeId = `node-d${deep - 1}-b${b}`;
      result = result + fullJSXStringCreator({
        ...options,
        id: nodeId,
        deep: deep - 1,
      });
    }

  }
  return `<div id="${id}">${result}</div>`;
};

export const outputDSLFile = (str) => {

  fs.writeFile(path.resolve('./src/DSLTest.json'), str, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
}


export const outputRCFile = (str) => {
  const reactComponent = `
/* eslint-disable */
import React from 'react';
export default () => {
  return <div id="test">${str}</div>
}
  `

  fs.writeFile(path.resolve('./src/JSXTest.tsx'), reactComponent, err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
}

const DSLValue = fullTreeCreator({
  deep: DEEP,
  breadth: BREADTH,
  createNode: (id) => {
    return {
      id,
      name: 'View'
    }
  }
});
const JSXValue = fullJSXStringCreator({
  deep: DEEP,
  breadth: BREADTH
});


outputDSLFile(JSON.stringify(DSLValue))
outputRCFile(JSXValue)
