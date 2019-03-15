const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: './src/index.js',

    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },

    mode: 'development',

    module: {
        rules: [
            { test: /\.(js)$/, use: 'babel-loader'},
            { test: /\.css$/, use: ['style-loader', 'css-loader'] }
        ]
    },

    devServer: {
        port: 80
    },

    plugins: [
        new HtmlWebPackPlugin({ template: './src/index.html' })
    ]

}
