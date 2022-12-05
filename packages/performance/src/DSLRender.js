import { engine } from 'whimsical-react';
import testDSL from './DSLTest.json';

const num = 100;
let i = 0;

const result = [];

function test() {
  const startTime = +new Date();
  engine.render(
    {
      node: testDSL,
    },
    'root',
    () => {
      result.push(+new Date() - startTime)
      i++;
      if (i < num) {
        test();
      } else {
        console.log(result);
      }
      return null;
    }
  );
}
test()
