const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const version = process.env.npm_package_version;

module.exports = [
    merge(common, {
        entry: {
            "fight-caves-sim": "./src/js/index.js"
        },
        mode: 'production',
        optimization: {
            minimizer: [
                new TerserJSPlugin({}),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                {
                    from: "./static"
                }
            ]),
            new HtmlWebpackPlugin({
                hash: true,
                filename: "./index.html",
                template: "./templates/index.html"
            })
        ],
        output: {
            filename: "[name]-" + version + ".js",
            path: path.resolve(__dirname, 'docs')
        }
    })
];
