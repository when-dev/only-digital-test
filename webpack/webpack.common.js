const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: path.resolve(__dirname, '../src/index.tsx'),
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: 'bundle.js',
		clean: true,
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../public/index.html'),
		})
	]
}