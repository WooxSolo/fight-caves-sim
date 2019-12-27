const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV === "development";
const version = process.env.npm_package_version;

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: devMode
                        }
                    },
                    "css-loader"
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name]-" + version + ".css",
            chunkFilename: "[id].css"
        })
    ]
};
