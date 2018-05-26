module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel',
        include: __dirname + '/src',
        query: {
          presets: ['react', 'es2015', 'stage-1'],
          plugins: ["transform-decorators-legacy"]
        }
      },
      {
        test: /\.css/,
        loaders: ['style', 'css'],
        include: __dirname + '/src'
      }
    ]
    
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './',
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  }
};
