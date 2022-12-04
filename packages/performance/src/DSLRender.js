import { engine } from 'whimsical-react';
import testDSL from './DSLTest.json';

engine.render(
  {
    node: testDSL,
  },
  'root',
  () => {
    console.log('after render');
    return null;
  }
);
