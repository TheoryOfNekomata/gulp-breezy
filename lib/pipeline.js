(function () {
    var gulp = require('gulp');

    module.exports = function buildPipeLine(opts, cb) {
        var pipeline;

        if (!!opts.src) {
            return cb(null);
        }

        pipeline = gulp.src(opts.src);

        opts.pipeline.forEach(function (pipeComponent) {
            if (typeof pipeComponent === 'string') {
                pipeline = pipeline.pipe(require(pipeComponent));
                return
            }

            pipeline = pipeline.pipe(pipeComponent);

            //if (typeof pipeComponent.module === 'string') {
            //    pipeComponent.module = require(pipeComponent.module);
            //}
            //
            //if (!!pipeComponent.options) {
            //    pipeline = pipeline.pipe(
            //        require(pipeComponent.module)(pipeComponent.options)
            //    );
            //    return;
            //}
            //
            //pipeline = pipeline.pipe(
            //    require(pipeComponent.module)
            //        .apply(null, pipeComponent.args || [])
            //);
        });

        if (!!opts.dest) {
            pipeline.pipe(gulp.dest(opts.dest));
        }

        if (!!cb) {
            pipeline.on('end', cb);
        }

        return pipeline;
    };
})();
