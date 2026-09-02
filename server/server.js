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
import apiRoutes from './routes/index';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const CURRENT_WORKING_DIR = process.cwd();
const isDevelopment = config.env !== 'production';

// ── Webpack dev middleware ────────────────────────────────────
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

app.use(express.json());

// ── Serve uploaded images ────────────────────────────────────
app.use('/uploads', express.static(path.join(CURRENT_WORKING_DIR, 'uploads')));

// ── API routes ────────────────────────────────────────────────
app.use('/api', apiRoutes);

// ── API 404 — unknown /api/* routes return JSON, not HTML ─────
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found', path: req.path });
});

// ── SSR catch-all ─────────────────────────────────────────────
app.get('*', (req, res) => {
  const context = {};
  const markup = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );
  res.status(200).send(template({ markup, css: '' }));
});

// ── Central error handler (must be last) ─────────────────────
app.use(errorHandler);

app.listen(config.port, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Server started on port ${config.port}`);
});
