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
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.registerTask('default', ['karma:unit_global', 'karma:unit_requirejs']);
};