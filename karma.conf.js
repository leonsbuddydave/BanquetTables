module.exports = function(config) {
	config.set({
		browsers: ['Chrome'],
		frameworks: ['jasmine'],
		files: [
			'.tmp/scripts/*.js',
			'.tmp/test/**/*.spec.js'
		]
	});
}