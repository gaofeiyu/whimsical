import React from 'react';
import ReactDOM from 'react-dom/client';
import Playground from './pages/playground';
import { wBodyMock, componentInfoMock } from './mock/wNode';
import './index.less';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Playground bodySchema={wBodyMock} componentInfo={componentInfoMock} />
  </React.StrictMode>
);
