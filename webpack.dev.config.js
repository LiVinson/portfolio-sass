const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	entry: {
		main: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true',
      "./modernizr.js",
			'./src/javascript/index.js',
		],
	},
	output: {
		path: path.join(__dirname, 'dist'),
		publicPath: '/',
		filename: 'index.js',
		assetModuleFilename: 'images/[hash][ext][query]'
	},
	target: 'web',
	devtool: 'source-map',
	mode: 'development',

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.html$/,
				use: [
					{
						loader: 'html-loader',
					},
				],
			},
			{
				// Apply rule for .sass, .scss or .css files
				test: /\.(sa|sc|c)ss$/,
				use: [
					{
						// After all CSS loaders we use plugin to do his work.
						// It gets all transformed CSS and extracts it into separate
						// single bundled file
						loader: MiniCssExtractPlugin.loader,
					},
					{
						//  This loader resolves url() and @imports inside CSS
						loader: 'css-loader',
				
					},
					{
						// Transform SASS to standard CSS
						loader: 'sass-loader',
						options: {
							implementation: require('sass'),
						},
					},
				]
			},
			{
				test: /\.pdf$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'files',
				},
			},
			/*
				replaced by default type: asset/resource in Webpack5
			{
				test: /\.(png|jpg|gif|svg|webp)$/,
				loader: 'file-loader',
				exclude: [/_sprite.svg/],
				options: {
					name: '[name].[ext]',
					outputPath: 'images',
				},
			},*/
			{
				test: /\.(png|jpg|gif|svg|webp)$/,
				exclude: [/_sprite.svg/],
				type: "asset/resource"
			},
			{
				test: /\.svg$/i,

				// from all svg images
				// include only sprite image
				include: /.*_sprite\.svg/,

				use: [
					{
						loader: 'svg-sprite-loader',
					},
				],
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'fonts/',
						},
					},
				],
			},	
		],
	},
	plugins: [
		new HtmlWebPackPlugin({
			template: './src/html/index.html',
			filename: './index.html',
			excludeChunks: ['server'],
			inject: 'head', //put script in head instead of before body closing tag
			scriptLoading: 'defer', //add defer so non-blocking
		}),
		new MiniCssExtractPlugin({
			filename: 'bundle.css',
			chunkFilename: '[id].css',
		}),
		new SpriteLoaderPlugin(),
		new FaviconsWebpackPlugin({
			logo: './src/img/favicons/favicon.png',
			favicons: {
				icons: {
					appleStartup: false,
				},
			},
    }),   
		new webpack.DefinePlugin({
			'process.env.CONTACT_URL': JSON.stringify('http://localhost:3000'),
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
}
