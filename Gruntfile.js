module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			vender: {
				src: 'public/js/src/libs/**/*.js',
				dest: 'public/js/build/libs.js'
			},
			dev: {
				src: ['public/js/src/**/*.js', '!public/js/src/libs/**/*.js'],
				dest: 'public/js/build/client.js'
			},
			all: {
				src: 'public/js/src/**/*.js',
				dest: 'public/js/build/main.js'
			}
		},
		uglify: {
			prod: {
				src: ['public/js/build/*.js', '!public/js/build/main.min.js'],
				dest: 'public/js/build/main.min.js'
			}
		},
		concat: {
			dev: {
				src: ['public/js/build/libs.js', 'public/js/build/client.js'],
				dest: 'public/js/build/main.js'
			}
		},
		sass: {
			dev: {
				options: {
					trace: true,
					style: 'expanded'
				},
				files: {
					'public/css/main.css': 'public/scss/main.scss'
				}
			},
			prod: {
				options: {
					style: 'compressed'
				},
				files: {
					'public/css/main.min.css': 'public/scss/main.scss'
				}
			}
		},
		env: {
			dev: {
				NODE_ENV: 'DEVELOPMENT'
			},
			prod: {
				NODE_ENV: 'PRODUCTION'
			}
		},
		watch: {
			js: {
				files: ['public/js/src/**/*.js'],
				tasks: ['browserify:dev', 'concat:dev']
			},
			css: {
				files: ['public/scss/**/*.scss'],
				tasks: ['sass:dev']
			}
		},
		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					watchExtensions: ['js', 'json'],
					ignoredFiles: ['node_modules/**', 'public/**']
				}
			}
		},
		concurrent: {
			dev: {
				tasks: ['env:dev', 'watch', 'nodemon'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.registerTask('dev', ['watch:dev']);
	grunt.registerTask('start', ['concurrent']);
	grunt.registerTask('deploy', ['env:prod', 'browserify:all', 'uglify', 'sass:prod']);
};