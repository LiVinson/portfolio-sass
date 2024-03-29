const path = require("path")
const webpack = require("webpack")
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const SpriteLoaderPlugin = require("svg-sprite-loader/plugin")
const TerserPlugin = require("terser-webpack-plugin")
const FaviconsWebpackPlugin = require("favicons-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: {
    index: "./src/javascript/index.js",
    modernizr: "./modernizr.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    // filename: "index.js",
    assetModuleFilename: 'images/[hash][ext][query]'

  },
  target: "web",
  devtool: "source-map",
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: 6,
        },
      }),
      new CssMinimizerPlugin({}),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },

      {
        // Apply rule for .sass, .scss or .css files
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            // After all CSS loaders get all transformed CSS and extracts it into separate
            // single bundled file
            loader: MiniCssExtractPlugin.loader,
          },
          {
            // This loader resolves url() and @imports inside CSS
            loader: "css-loader",
          },
          {
            // apply postCSS fixes like autoprefixer and minifying
            loader: "postcss-loader",
          },
          {
            // Transform SASS to standard CSS
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
            },
          },
        ],
      },
      {
        test: /\.pdf$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "files",
        },
      },
     /*
     				replaced by default type: asset/resource in Webpack5

      {
        test: /\.(png|jpg|gif|svg|webp)$/,
        loader: "file-loader",
        exclude: /_sprite.svg/,
        options: {
          
          outputPath: "images",
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
            loader: "svg-sprite-loader"

          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html",
      excludeChunks: ["server"],
      inject: "head", //put script in head instead of before body closing tag
      scriptLoading: "defer" //add defer so non-blocking

    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new SpriteLoaderPlugin(),
    new FaviconsWebpackPlugin({
      logo: "./src/img/favicons/favicon.png", 
      favicons: {
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          favicons: true,
          windows: true,
          yandex: false,
        }
      } 
      
    }),  
    new webpack.DefinePlugin({
      "process.env.CONTACT_URL": JSON.stringify("https://lv-portfolio-api.herokuapp.com")
    }),  
  ],
}
