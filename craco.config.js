const CopyPlugin = require('copy-webpack-plugin');
const CracoLessPlugin = require('craco-less');
const CracoAlias = require('craco-alias');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * These settings are used to modify the webpack config.
 */

module.exports = ({ env }) => {
  const isProductionBuild = process.env.NODE_ENV === 'production';
  const analyzerMode = process.env.REACT_APP_INTERACTIVE_ANALYZE ? 'server' : 'json';

  const plugins = [
    new CopyPlugin({
      patterns: [{ from: 'src/themes', to: 'themes' }],
    }),
  ];

  if (isProductionBuild) {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode }));
  }

  return {
    webpack: {
      plugins,
    },
    plugins: [
      {
        plugin: CracoLessPlugin,
        options: {
          lessLoaderOptions: {
            lessOptions: {
              javascriptEnabled: true,
            },
          },
        },
      },
      {
        plugin: CracoAlias,
        options: {
          source: 'tsconfig',
          baseUrl: './src',
          tsConfigPath: './tsconfig.paths.json',
        },
      },
    ],
  };
};
