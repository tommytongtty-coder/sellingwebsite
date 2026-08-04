import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const mountNode = document.getElementById('root');

const render = (Component) => {
  ReactDOM.hydrate(
    <BrowserRouter><Component /></BrowserRouter>,
    mountNode
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    render(NextApp);
  });
}
