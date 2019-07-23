const path = require('path');

module.exports = env => {
  return {
    mode: 'development',
    resolve: {
      extensions: ['.js', '.jsx']
    },
    ...(env === 'lf' && {
      entry: './losningsforslag/index.jsx'
    }),
    output: {
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /.(js|jsx)$/,
          use: 'babel-loader'
        },
        { test: /.css$/, use: ['style-loader', 'css-loader?url=false'] }
      ]
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
      hot: true
      //   open: true
    }
  };
};
