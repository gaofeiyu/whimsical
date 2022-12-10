import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './JSXTest';
import './index.css';

const num = 100;
let i = 0;

const result = [];

function test() {
  const startTime = +new Date();
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  setTimeout(() => {
    result.push(+new Date() - startTime);
    i++;
    if (i < num) {
      test();
    } else {
      console.log(result);
    }
  }, 0);
}
test();
