(function () {
    module.exports = function normalizeOptions(opts) {
        if (typeof opts === 'string') {
            opts = {
                deps: [opts]
            };
        }

        if (!(opts instanceof Object)) {
            throw new Error('Invalid options');
        }

        if (opts instanceof Array) {
            opts = {
                deps: opts
            };
        }

        opts.src = opts.src || [];
        opts.dest = opts.dest || null;
        opts.pipeline = opts.pipeline || [];
        opts.deps = opts.deps || [];

        if (typeof opts.watch !== 'boolean') {
            opts.watch = false;
        }

        if (typeof opts.default !== 'boolean') {
            opts.default = true;
        }

        return opts;
    };
})();
