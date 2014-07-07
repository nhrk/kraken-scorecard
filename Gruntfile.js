'use strict';


module.exports = function(grunt) {

	require('time-grunt')(grunt);

	// Load the project's grunt tasks from a directory
	require('grunt-config-dir')(grunt, {
		configDir: require('path').resolve('tasks')
	});

	// Register group tasks
	grunt.registerTask('build', ['jshint', 'sass', 'requirejs', 'i18n', 'copyto']);
	grunt.registerTask('test', ['jshint', 'mochacli']);
	grunt.registerTask('deploy', ['shell:git_pull', 'shell:npm_install']);
	grunt.registerTask('rollout', ['build', 'shell:pm2_reload']);
	/* PM2 functions */
	grunt.registerTask('reload', ['shell:pm2_reload']);
	grunt.registerTask('softReload', ['shell:pm2_softReload']);
	grunt.registerTask('restart', ['shell:pm2_restart']);

};