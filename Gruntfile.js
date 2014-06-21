/* jshint es3:false */
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        browserify: {
            dev: {
                files: {
                    'flexboard.js': 'src/flexboard.js'
                },
                options: {
                    bundleOptions: {
                        standalone: 'Flexboard'
                    }
                }
            }
        }
    });

};
