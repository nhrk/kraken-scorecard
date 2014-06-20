'use strict';


module.exports = function(grunt) {
	// Load task
	grunt.loadNpmTasks('grunt-shell');

	// Options
	return {
		ls: { // Target
			options: { // Options
				stderr: false
			},
			command: 'ls'
		},
		git_pull: {
			options: { // Options
				stderr: true,
				stdin: true,
				callback: function(err, stdout, stderr, cb){
					// console.log(err,stdout,stderr);
					cb();	
				}
			},
			command: 'git pull'	
		},
		npm_install: {
			options: { // Options
				stderr: true,
				stdin: true
			},
			command: 'npm install'	
		},
		pm2_reload: {
			options: { // Options
				stderr: true,
				stdin: true
			},
			command: 'pm2 reload all'
		}
	};
};