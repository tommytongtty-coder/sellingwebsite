const webpack = require('webpack');

const clientConfig = require('../webpack.config.client.production');
const serverConfig = require('../webpack.config.server');

const runWebpack = (config) =>
  new Promise((resolve, reject) => {
    webpack(config, (error, stats) => {
      if (error) {
        reject(error);
        return;
      }

      if (stats.hasErrors()) {
        reject(
          new Error(
            stats.toString({
              all: false,
              colors: false,
              errors: true,
            })
          )
        );
        return;
      }

      console.log(
        stats.toString({
          all: false,
          colors: false,
          modules: true,
          warnings: true,
        })
      );
      resolve();
    });
  });

const build = async () => {
  process.env.NODE_ENV = 'production';
  await runWebpack(clientConfig);
  await runWebpack(serverConfig);
  console.log('Build complete.');
};

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
