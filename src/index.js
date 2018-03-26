import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import Route from './router/router.config';
import Store from './stores';
import './commonCss/base.less';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
  <Provider {...Store}>
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);
registerServiceWorker();
