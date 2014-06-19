/* jshint es3:false */
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');

    grunt.initConfig({
        browserify: {
            dist: {
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
