module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    qunit: {
      all: ['spec/backbone-qunit.html']
    },
    karma: {
      options: {
        configFile: 'spec/karma.conf.js',
        browsers: ['PhantomJS'],
        singleRun: true,
        autoWatch: false
      },
      ci: {
        options: {
          reporters: ['dots'],
          singleRun: true
        }
      },
      watch: {
        options: {
          browsers: ['Chrome'],
          reporters: ['dots', 'growl'],
          singleRun: false,
          autoWatch: true
        }
      },
      coverage: {
        options: {
          reporters: ['coverage'],
          preprocessors: {
            'backbone-validator.js': 'coverage'
          }
        }
      }
    },
    uglify: {
      'backbone-validator-min.js': ['backbone-validator.js']
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'spec/**/*spec.js',
        'backbone-validator.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    version: {
      update: {
        src: ['bower.json', 'package.json', 'backbone-validator.js']
      }
    },

    exec: {
      'npm-publish': {
        cmd: 'npm publish'
      }
    }
  });

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-version');
  grunt.loadNpmTasks('grunt-exec');

  grunt.registerTask('test', ['jshint', 'karma:ci', 'qunit']);
  grunt.registerTask('default', ['test']);

  grunt.registerTask('release', 'Releasing new version with update version', function() {
    var type = this.args[0] || 'patch';
    grunt.task.run(['test', 'version:update:' + type, 'uglify']);
    grunt.log.ok('Run grunt exec:npm-publish to release npm module update');
  });
};
