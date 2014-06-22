var gulp        = require('gulp');
var browserify  = require('browserify');
var watchify    = require('watchify');
var fs          = require('fs');

// Flags
var watchChanges = false;

// Top-level tasks
gulp.task('default', ['bundle']);
gulp.task('watch', ['watch for changes', 'bundle']);

/**
 * Tells the "bundle" task that it must use watchify instead
 */
gulp.task('watch for changes', function() {
    watchChanges = true;
});

/**
 * Use Browserify to build the application
 */
gulp.task('bundle', function() {

    var bundleMethod = watchChanges ? watchify : browserify;

    var bundler = bundleMethod({
        'basedir': './src',
        'entries': ['./index.js']
    });

    var bundle = function () {
        var destFile = fs.createWriteStream('flexboard.js');
        var readStream = bundler.bundle({
                'standalone': 'Flexboard'
            });
        readStream.pipe(destFile);
        return readStream;
    };

    if (watchChanges) {
        bundler.on('update', bundle);
    }

    return bundle();
});
