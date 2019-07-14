var path = require('path');
var staticPath = __dirname + "/dist";
var helpersPath = __dirname + "/examples/helpers";

module.exports = {
    entry: {
        test: './examples/test.ts'
    },
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: staticPath
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(t|j)s$/,
                exclude: /(node_modules)/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.hbs$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'handlebars-loader?debug=true&helperDirs[]=' + helpersPath,
                    options: {
                        debug: true,
                        helperDirs: [helpersPath],
                        knownHelpers: ['pre-text', 'TodoList']
                    }
                }
            }
        ]
    }
};
