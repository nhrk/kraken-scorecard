'use strict';


module.exports = function(grunt) {
	// Load the project's grunt tasks from a directory
	require('grunt-config-dir')(grunt, {
		configDir: require('path').resolve('tasks')
	});

	// Register group tasks
	grunt.registerTask('build', ['jshint', 'sass', 'requirejs', 'i18n', 'copyto']);
	grunt.registerTask('test', ['jshint', 'mochacli']);
	grunt.registerTask('deploy', ['shell:git_pull', 'shell:npm_install', 'build']);
	grunt.registerTask('reload', ['shell:pm2_reload']);
	grunt.registerTask('bump', ['deploy', 'shell:pm2_reload']);

};