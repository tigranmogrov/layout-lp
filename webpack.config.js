const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const scriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const os = require('os');
/* analyzing */
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/* get local ip */
function getLocalIp() {
	const iFaces = os.networkInterfaces();

	console.log('===============================');
	console.log('Your local ip addresses:');

	Object.keys( iFaces ).forEach( (ifName) => {
		let alias = 0;

		iFaces[ifName].forEach(function (iFace) {
			if ( 'IPv4' !== iFace.family || iFace.internal !== false ) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}

			if ( alias >= 1 ) {
				// this single interface has multiple ipv4 addresses
				console.log(ifName + ':' + alias, iFace.address);
			} else {
				// this interface has only one ipv4 adress
				console.log(ifName, iFace.address);
			}
			++alias;
		});
	});
	console.log('===============================');
}
process.argv.forEach( arg => {
	if ( /--ip/.test( arg ) ) {
		getLocalIp();
	}
});

/* config Fn */
module.exports = (env, argv) => {
	const config = {};

	/* set process.env for other requirements */
	process.env.NODE_ENV = argv.mode;

	/* global states */
	const IS_PROD = argv.mode === 'production';
	const IS_WATCH = argv.watch;
	const IS_HOST = argv.host === 'localhost';
	const IS_STATIC = argv.host === undefined;
	const IS_SOURCEMAP = argv.sourceMap;
	const SOURCEMAP = IS_HOST || IS_SOURCEMAP;
	const DEFAULTS = { description: 'description', keywords: 'keywords' };

	/* Methods */
	function getHtmlWebpackPlugins( dir, ext, chunkName ) {
		const files = fs.readdirSync(path.resolve(__dirname, dir));
		let results = [];

		files.map(item => {
			const parts = item.split('.');
			const name = parts[0];
			const extension = parts[1];
			const filename = `${dir}/${name}.${ext}`;
			const options = {
				filename: filename.replace( './src/', '' ),
				template: `${dir}/${name}.${ext}`,
				hash: false,
				inject: 'body',
				minify: {
					removeScriptTypeAttributes: true,
					removeComments: IS_PROD,
				}
			};

			if ( chunkName ) {
				options.chunks = chunkName.split( ' ' );
			}

			if ( !IS_HOST && !IS_WATCH ) {
				options.excludeChunks = [ 'environment' ];
			}

			if (extension && ext === extension) {
				results.push( new htmlWebpackPlugin( { ...DEFAULTS, ...options } ) );
			}
		});
		return results;
	}

	/* entry */
	const entry = {
		'es2015-polyfills': './src/js/es2015-polyfills.js',
		'index': [ './src/js/index.js', './src/styles/index.scss' ]
	};

	/* plugins */
	const indexChunk = getHtmlWebpackPlugins( './src', 'html' );
	const allHtmlChunk = [ ...indexChunk ];

	const uglifyJs = new UglifyJsPlugin({
		cache: true,
		parallel: true,
		sourceMap: SOURCEMAP,
	});
	const cssPlugin = new MiniCssExtractPlugin({
		filename: 'styles/[name].css',
	});
	const copyPlugin = new CopyWebpackPlugin([
		{
			from: './src/styles/*.css',
			to: './styles',
			flatten: true
		},
		{
			from: './src/styles/common',
			to: './styles/common',
		},
		{
			from: './src/js/common',
			to: './js/common',
		},
		{
			from: 'src/api',
			to: 'api/',
		},
		{
			from: 'src/images',
			to: 'images/',
		},
		{
			from: 'src/media',
			to: 'media/',
		},
		{
			from: 'src/fonts',
			to: 'fonts/',
		},
	]);
	const nomodule = new scriptExtHtmlWebpackPlugin({
		custom: {
			test: /es2015-polyfills\.js$/,
			attribute: 'nomodule'
		}
	});

	config.plugins = [ cssPlugin, ...allHtmlChunk, nomodule ];
	IS_STATIC && config.plugins.push( new CleanWebpackPlugin([ 'public/*' ]) );
	IS_STATIC && config.plugins.push( copyPlugin );
	IS_HOST && config.plugins.push( new webpack.HotModuleReplacementPlugin() );

	/* optimization */
	config.optimization = {
		runtimeChunk: 'single',
		minimizer: []
	};
	IS_PROD && config.optimization.minimizer.push( uglifyJs );

	/* modules */
	const html = {
		test: /\.html$/,
		include: [/parts/],
		use: {
			loader: 'raw-loader',
		}
	};
	const js = {
		test: /\.js$/,
		//exclude: /node_modules/,
		//exclude: /node_modules\/(?!(body-scroll-lock)\/).*/,
		use: {
			loader: 'babel-loader',
			options: {
				presets: [
					['@babel/preset-env' ,{
						modules: false,
						useBuiltIns: false
					}]
				],
				plugins: [
					'@babel/plugin-syntax-dynamic-import',
					[ '@babel/plugin-proposal-decorators', { legacy: true } ],
					[ '@babel/plugin-proposal-class-properties', { loose: true } ]
				]
			}
		}
	};
	const DevPostcss = {
		loader: 'postcss-loader',
		options: {
			ident: 'postcss',
			plugins: (loader) => [
				require('postcss-import')({root: loader.resourcePath})
			],
			sourceMap: SOURCEMAP,
		},
	};
	const ProdPostcss = {
		loader: 'postcss-loader',
		options: {
			ident: 'postcss',
			plugins: (loader) => [
				require('postcss-import')({ root: loader.resourcePath }),
				require('autoprefixer')(),
				require('cssnano')({
					presets: 'advanced'
				})
			],
			sourceMap: SOURCEMAP,
		},
	};
	const css = {
		test: /\.css$/,
		use: [
			{ loader: 'css-hot-loader' },
			{
				loader: MiniCssExtractPlugin.loader,
				options: {
					publicPath: '../'
				}
			},
			{
				loader: 'css-loader',
				options: {
					importLoaders: 2,
					modules: false,
					sourceMap: SOURCEMAP,
				}
			},
			IS_PROD ? ProdPostcss : DevPostcss
		]
	};
	const scss = {
		test: /\.scss$/,
		//exclude: /node_modules/,
		use: [
			{ loader: 'css-hot-loader' },
			{
				loader: MiniCssExtractPlugin.loader,
				options: {
					publicPath: '../'
				}
			},
			{ loader: 'css-loader',
				options: {
					importLoaders: 2,
					modules: false,
					sourceMap: SOURCEMAP,
				}
			},
			IS_PROD ? ProdPostcss : DevPostcss,
			{ loader: 'sass-loader', options: { sourceMap: SOURCEMAP, } },
		]
	};
	const images = {
		test: /\.(jpe?g|png|gif|svg|ico)$/,
		exclude: [/fonts/, /node_modules/],
		use: [
			{
				loader: 'url-loader',
				options: {
					limit: 8192,
					name: '[path][name].[ext]',
					context: 'src/',
				}
			}
		]
	};
	const fonts = {
		test: /\.(woff2?|ttf|svg|otf|eot)$/,
		exclude: [/images/, /node_modules/],
		use: {
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]',
				context: 'src/',
			}
		}
	};
	const media = {
		test: /\.(mp4|mp3)$/,
		exclude: /node_modules/,
		use: {
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]',
				context: 'src/',
			}
		}
	};

	config.module = {};
	config.module.rules = [
		html,
		js,
		css,
		scss,
		images,
		fonts,
		media
	];

	/* sourcemap */
	config.devtool = SOURCEMAP ? 'source-map': 'none';

	/* devServer */
	config.devServer = {
		contentBase: path.resolve(__dirname, './src'),
		host: '192.168.1.198',
		port: 8080,
		stats: 'minimal',
		overlay: true,
		hot: IS_HOST,
		watchContentBase: true,
		open: true,
	};

	/* others */
	config.entry = entry;
	config.output = {
		filename: 'js/[name].js',
		path: path.resolve(__dirname, './public'),
	};
	config.resolve = { extensions: ['.ts', '.tsx', '.js'] };
	config.stats = 'minimal';

	/* environment parts fix */
	if ( IS_HOST || IS_WATCH ) {
		config.entry['environment'] = fs.readdirSync( path.resolve( __dirname, './src/parts' ) )
			.map((filepath) => path.resolve( __dirname, path.join( './src/parts', filepath ) ) );
	}

	return config;
};
