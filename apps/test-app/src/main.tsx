import './globals.css'
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import Provider from "./provider";

import Router from './router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider>
      <Router />
    </Provider>
  </StrictMode>
);
