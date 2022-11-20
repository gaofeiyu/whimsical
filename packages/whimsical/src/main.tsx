import React from 'react';
import ReactDOM from 'react-dom/client';
import Playground from './pages/playground';
import './index.less';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Playground />
  </React.StrictMode>
);
