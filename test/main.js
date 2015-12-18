(function () {
    var gulp = require('gulp');

    describe('Registering', function () {
        var breezy;

        beforeEach(function () {
            breezy = require('./../index');
        });

        it('should work for an implicit default task', function () {
            breezy('task1', function () {});

            expect(breezy.getDefaultTasks()).toContain('task1');
        });

        it('should work for an explicit default task', function () {
            breezy('task2', { 'default': true });

            expect(breezy.getDefaultTasks()).toContain('task2');
        });

        it('should work for a non-default task', function () {
            breezy('task3', { 'default': false });

            expect(breezy.getDefaultTasks()).not.toContain('task3');
        });

        it('should work with a watched source glob', function () {
            var watchParams;

            breezy('task4', { src: './../**/*.js', watch: true });
            breezy('task5', { src: './sass/**/*.scss', watch: true });
            breezy('task6', { src: './sass/**/*.scss', watch: true });

            watchParams = breezy.getWatchParams();

            expect(watchParams.filter(function (param) {
                return param.task === 'task3';
            }).length).toBe(0);

            expect(watchParams.filter(function (param) {
                return param.task === 'task4';
            }).length).toBe(1);

            expect(watchParams.filter(function (param) {
                return param.src === './sass/**/*.scss';
            }).length).toBe(2);
        });

        it('should work with dependency task(s)', function () {
            expect(function () {
                breezy('task7', 'task1');
                breezy('task8', ['task7', 'task5', 'task2']);
            }).not.toThrow();
        });

        it('should throw an exception for a task with the same name as any previously defined task', function () {
            expect(function () {
                breezy('task1', function () {});
            }).toThrow();
        });

        it('should throw an exception for a task without required parameters', function () {
            expect(function () {
                breezy('task9');
            }).toThrow();
        });

        it('should throw an exception for a task with parameters of invalid type', function () {
            expect(function () {
                breezy('task10', 5);
            }).toThrow();

            expect(function () {
                breezy('task11', null);
            }).toThrow();
        });

        it('should throw an exception when declaring an undeclared task as dependency', function () {
            expect(function () {
                breezy('task12', ['notask']);
            }).toThrow();
        });
    });
})();
