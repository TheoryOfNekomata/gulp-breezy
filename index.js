(function () {
    var breezy,
        isTaskDefault = {},
        watchParams = [],

        defineIfDefault = function (name, isDefault) {
            isTaskDefault[name] = isDefault;
        },

        isTaskDefined = function (name) {
            return isTaskDefault[name] !== undefined;
        },

        addToWatchParams = function (src, name) {
            watchParams.push({ src: src, task: name });
        },

        checkTaskOptions = function (name, opts) {
            opts.deps.forEach(function (dep) {
                if (!isTaskDefined(dep)) {
                    throw new Error('Dependency ' + name + ' is not yet defined');
                }
            });

            // opts.default should be strictly boolean
            if (typeof opts.default !== 'boolean') {
                opts.default = true;
            }

            defineIfDefault(name, opts.default);

            if (opts.watch) {
                addToWatchParams(opts.src, name);
            }
        },

        defineTask = function (name, opts, cb) {
            var task;

            opts = require('./lib/options')(opts);
            task = require('./lib/task')(name, opts, cb);

            checkTaskOptions(name, opts);

            return task;
        },

        defineDefaultOptsTask = function (name, cb) {
            return defineTask(name, {}, cb);
        };

    breezy = function breezy(name, opts, cb) {
        var task;

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

    breezy.getDefaultTasks = function () {
        return Object.keys(isTaskDefault).filter(function (name) {
            return isTaskDefault[name];
        });
    };

    breezy.getWatchParams = function () {
        return watchParams;
    };

    module.exports = breezy;
})();
