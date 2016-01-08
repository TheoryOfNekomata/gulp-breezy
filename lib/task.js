(function () {
    var gulp = require('gulp'),
        buildPipeLine = require('./pipeline');

    module.exports = function registerGulpTask(name, opts, cb) {
        if (!cb) {
            // synchronous task
            return gulp.task(name, opts.deps, function () {
                buildPipeLine(opts);
            });
        }

        // asynchronous task
        if (!(cb instanceof Function)) {
            throw new Error('Expected function for callback parameter');
        }

        return gulp.task(name, opts.deps, function () {
            buildPipeLine(opts, cb);
        });
    };
})();
