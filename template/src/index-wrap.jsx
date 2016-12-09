import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Wrap from './wrap';

const rootEl = document.getElementById('root');

if (DEBUG) {
  ReactDOM.render(
    (<AppContainer><Wrap /></AppContainer>), rootEl
  );

  if (module.hot) {
    module.hot.accept('./wrap', () => {
      // If you use Webpack 2 in ES modules mode, you can
      // use <App /> here rather than require() a <NextApp />.
      const NextApp = require('./wrap').default;

      ReactDOM.render(
        <AppContainer>
          <NextApp />
        </AppContainer>,
        rootEl
      );
    });
  }
} else {
  ReactDOM.render(<Wrap />, rootEl);
}

