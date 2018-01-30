
const webpack = require('webpack');

const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

const libraryName = 'cs-gridstack';

let plugins = [], outputFile;
outputFile = libraryName + '.[name].js';

const output = {
  path: __dirname + '/lib',
  filename: outputFile,
  library: libraryName,
  libraryTarget: 'umd'
  // umdNamedDefine: true
};

const mod = {
  rules: [  
    {
      test: /\.ts$/,
      exclude: /node_modules/,
      loader: 'ts-loader'
    },
    {
      test: /\.html$/,
      loader: 'raw-loader',
      exclude: ['./src/index.html']
    }, {
      test: /\.scss$/,
      use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader'
      }
      ]
    },
    {
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      }
      ]
    }
  ]
};

function buildConfig(entry, externals, analyzer) {
  return baseConfig =
    {
      entry: entry,
      // entry: __dirname + '/src/index.ts',
      devtool: 'source-map',
      output: output,
      module: mod,
      externals: externals,
      resolve: {
        extensions: ['.ts', '.js', '.html'],
        alias: {
          'jquery-ui': path.resolve(__dirname, './../../node_modules/jquery-ui/ui')
        }
        // alias: {
        //     'jQuery': 'jquery'
        //     // 'jquery': 'jQuery'
        // }
      }
    };
}

const config = [
  buildConfig({ cs: ["./src/index.ts"] }, { 'cs-core': 'cs-core', '@csnext/cs-client': '@csnext/cs-client', 'vue': 'Vue', 'Vue': 'Vue' })
  // , buildConfig({ vuebundle: ["vue", "vue-router"] }, 'csvue')
];

module.exports = config;
