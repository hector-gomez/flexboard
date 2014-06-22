var gulp        = require('gulp');
var browserify  = require('browserify');
var fs          = require('fs');

gulp.task('default', ['browserify']);

/**
 * Use Browserify to build the application
 */
gulp.task('browserify', function() {
    var destFile = fs.createWriteStream('flexboard.js');

    var b = browserify({
        'basedir': './src',
        'entries': ['./flexboard.js']
    });

    var stream = b.bundle({
        'standalone': 'Flexboard'
    });

    stream.pipe(destFile);

    return stream;
});
