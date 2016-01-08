(function () {
    var breezy,
        isTaskDefault = {},
        watchParams = [],
        gulp = require('gulp'),

        defineIfDefault = function defineIfDefault(name, isDefault) {
            isTaskDefault[name] = isDefault;
        },

        isTaskDefined = function isTaskDefined(name) {
            return isTaskDefault[name] !== undefined;
        },

        addToWatchParams = function addToWatchParams(src, name) {
            watchParams.push({ src: src, task: name });
        },

        getDefaultTasks = function getDefaultTasks() {
            return Object.keys(isTaskDefault).filter(function (name) {
                return isTaskDefault[name];
            });
        },

        getUndefinedTasks = function getUndefinedTasks(taskNames) {
            if (!(taskNames instanceof Array)) {
                taskNames = [taskNames];
            }

            return taskNames.filter(function (taskName) {
                return !isTaskDefined(taskName);
            });
        },

        applyTaskOptions = function applyTaskOptions(name, opts) {
            var undefinedTasks, deps;

            undefinedTasks = getUndefinedTasks(opts.deps);

            if (undefinedTasks.length > 0) {
                deps = undefinedTasks.slice(-1).map(function (depName) {
                    return '[' + depName + ']';
                }).join(', ') + (
                    undefinedTasks.length > 1 ? (
                        ', and ' +
                        '[' + opts.deps.slice(opts.deps.length - 1) + ']'
                    ) : ''
                );

                throw new Error(
                    deps +
                    (undefinedTasks.length > 1 ? ' are' : ' is') +
                    ' not yet defined'
                );
            }

            // opts.default should be strictly boolean
            if (typeof opts.default !== 'boolean') {
                opts.default = true;
            }

            defineIfDefault(name, opts.default);

            if (opts.watch) {
                addToWatchParams(opts.src, name);
            }
        },

        defineTask = function defineTask(name, opts, cb) {
            var task;

            opts = require('./lib/options')(opts);
            task = require('./lib/task')(name, opts, cb);

            applyTaskOptions(name, opts);

            return task;
        },

        defineDefaultOptsTask = function defineDefaultOptsTask(name, cb) {
            return defineTask(name, {}, cb);
        },

        defaultWatchFunction = function defaultWatchFunction() {
            watchParams.forEach(function (watchPair) {
                if (!watchPair.src || !watchPair.task) {
                    throw new Error(
                        'Source glob and task name should be specified. ' +
                        '(src: ' + watchPair.src + ', task: ' +
                        watchPair.task + ')'
                    )
                }

                if (!(watchPair.src instanceof Array)) {
                    watchPair.src = [watchPair.src];
                }

                if (!(watchPair.task instanceof Array)) {
                    watchPair.task = [watchPair.task];
                }

                // default gulp watch
                // TODO add gulp-plumber?
                gulp.watch(watchPair.src, watchPair.task);
            });
        },

        createWatcherTask = function createWatcherTask(name, deps) {
            gulp.task(name || 'watch', deps || [], defaultWatchFunction);
        };

    breezy = function breezy(name, opts, cb) {
        if (arguments.length < 1) {
            throw new Error('Task name is required');
        }

        if (!(opts instanceof Object || typeof opts === 'string')) {
            throw new Error(
                'Invalid second parameter. Specify dependency ' +
                'task name(s), options object, or a callback ' +
                'function instead.'
            );
        }

        name = name.trim();

        if (isTaskDefined(name)) {
            throw new Error('Task ' + name + ' is already defined');
        }

        if (!(opts instanceof Function)) {
            return defineTask(name, opts, cb);
        }

        return defineDefaultOptsTask(name, opts);
    };

    breezy.getDefinedTasks = function getDefinedTasks() {
        return Object.keys(isTaskDefault);
    };

    breezy.getDefaultTasks = getDefaultTasks;

    breezy.createWatcherTask = createWatcherTask;

    module.exports = breezy;
})();
