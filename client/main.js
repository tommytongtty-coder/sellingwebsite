import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const mountNode = document.getElementById('root');

const render = (Component) => {
  ReactDOM.hydrate(<Component />, mountNode);
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}
