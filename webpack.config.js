const path = require('path');
const StringReplacePlugin = require('string-replace-webpack-plugin')
module.exports = {
  entry: {
    camera: ['./client/camera/entry.js'],
    projector: ['./client/projector/entry.js'],
    editor: ['./client/editor/entry.js'],
    paper: ['./client/paper/entry.js'],
  },
  output: {
    path: path.join(__dirname, 'www'),
    filename: '[name].js',
  },
  // node: {
  //   fs: 'empty'
  // },
  resolve: {
    alias: {
			fs: path.join(__dirname, './virtual-fs.js')
		}
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        query: {
          cacheDirectory: '.babel-cache',
          sourceMap: false,
        },
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[path][name]--[local]--[hash:base64:10]',
            },
          },
        ],
      },
      // Per https://github.com/devongovett/pdfkit/issues/659#issuecomment-321452649
      { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
      { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
      { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
      {
				test: /fontkit[/\\]index.js$/, loader: StringReplacePlugin.replace({
					replacements: [
						{
							pattern: /fs\./g,
							replacement: function () {
								return 'require(\'fs\').';
							}
						}
					]
				})
			},
      { test: /src[/\\]assets/, loader: 'arraybuffer-loader'},
      { test: /\.afm$/, loader: 'raw-loader'}
      // {
      //   test: /node_modules\/(unicode-properties|fontkit).*\.json$/,
      //   use: 'json-loader',
      // },
    ],
  },
  plugins: [
    new require('copy-webpack-plugin')([
      {
        from: 'node_modules/monaco-editor/min/vs',
        to: 'vs',
      },
    ]),
  ],
};
