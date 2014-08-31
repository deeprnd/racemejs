(function () {
    'use strict';
    module.exports = function(grunt) {
        grunt.initConfig({
            pkg: grunt.file.readJSON('package.json'),
            karma: {
                unit_global: {
                    configFile: 'karma.conf.js'
                },

                unit_requirejs: {
                    configFile: 'karma.conf.require.js'
                }
            },
            jasmine_node: {
                options: {
                    forceExit: true,
                    match: '.',
                    matchall: false,
                    extensions: 'js',
                    specNameMatcher: 'spec'
                },
                all: ['test/spec/']
            }
        });

        grunt.loadNpmTasks('grunt-karma');
        grunt.loadNpmTasks('grunt-jasmine-node');
        grunt.registerTask('default', ['jasmine_node', 
            'karma:unit_global', 'karma:unit_requirejs']);
    };
}());