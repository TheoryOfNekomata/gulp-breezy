(function () {
    var gulp = require('gulp'),
        jasmine = require('gulp-jasmine');

    gulp.task('test', function () {
        gulp.src('./test/**/*.js')
            .pipe(jasmine({ verbose: true }));
    });
})();
