const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    entry: "./src/js/index.js",
    mode: "development",
    devtool: "source-map",
    devServer: {
        contentBase: "./static",
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: "./templates/index.html"
        })
    ],
    output: {
        filename: "[name].js"
    }
});
