module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				corejs: "3",
				useBuiltIns: 'usage', // entry | usage
				modules: false,
				targets: {
					browsers: require('./package.json').browserslist
				},
				debug: true
			}
		]
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		["@babel/plugin-transform-runtime", {
			"corejs": 3
		}]
	],
	comments: false,
}