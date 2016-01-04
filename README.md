# gulp-breezy

Declare Gulp tasks fast.

```js
var concat = require('gulp-concat')
    breezy = require('gulp-breezy');

breezy('compile',
    {

        // gulp.src(...)
        src: './src/js/**/*.js',

        // in case you want to add this to a watch task
        watch: true,

        // Declare as a dependency of `default` task. This is `true` by default.
        'default': true,

        // Breezy does the pipeline for you, as long as you specify the modules
        // to be used, as well as its options:
        pipeline: [
            // specify the expression you ought to be putting inside `pipe()`
            concat('app.js'),
            sourcemaps.init(),

            // you can specify the module name without the arguments
            'gulp-uglify',
            sourcemaps.write('.')
        ],

        dest: './public/app.min.js',

        deps: ['another-task']
    }, function cb() { /* ... */ }
);

// ....

breezy('default', breezy.getDefaultTasks());

breezy('watch', ['default'], function () {
    breezy.getWatchParams().forEach(function (watchPair) {
        gulp.watch(watchPair.src, watchPair.name);
    });
});
```

## License

MIT
