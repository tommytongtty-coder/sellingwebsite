import path from 'path';
import express from 'express';
import webpack from 'webpack';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../config/config';
import template from '../template';
import App from '../client/App';

const app = express();
const CURRENT_WORKING_DIR = process.cwd();
const isDevelopment = config.env !== 'production';

if (isDevelopment) {
  const webpackConfig = require('../webpack.config.client');
  const compiler = webpack(webpackConfig);

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  app.use(webpackHotMiddleware(compiler));
} else {
  app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));
}

app.get('/api/health', (req, res) => {
  res.json({
    app: 'marketplace-template',
    ok: true,
    timestamp: new Date().toISOString(),
  });
});

app.get('*', (req, res) => {
  const context = {};
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  res.status(200).send(template({ markup, css: '' }));
});

app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Server started on port ${config.port}`);
});
