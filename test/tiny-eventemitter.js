describe('EventEmitter', function () {
    var eventEmitter = null;
    var Person = null;
    var joe = null;
    var $rootScope = null;

    beforeEach(module('rt.eventemitter'));

    beforeEach(inject(function ($injector) {
        $rootScope = $injector.get('$rootScope');
        eventEmitter = $injector.get('eventEmitter');
        Person = function Person() {};
        eventEmitter.inject(Person);
        joe = new Person();
    }));

    it('Has an inject and create functions', function () {
        assert.isFunction(eventEmitter.inject);
        assert.isFunction(eventEmitter.create);
    });

    it('Injects event methods on the class', function () {
        assert.isFunction(joe.on);
        assert.isFunction(joe.off);
        assert.isFunction(joe.emit);
    });

    it('Creates a new empty object that gets injection of event methods', function () {
        var emitter = eventEmitter.create();
        assert.isFunction(emitter.on);
        assert.isFunction(emitter.off);
        assert.isFunction(emitter.emit);
        emitter.id = 123;

        var emitter2 = eventEmitter.create();
        assert.equal(emitter.id, 123);
        assert.equal(emitter2.id, undefined);
    });

    it('Emits events', function () {
        var called = false;
        joe.on('test', function () { called = true; });
        joe.emit('test');
        assert.equal(called, true);
    });

    it('Subscribes with on', function () {
        var calls = 0;
        joe.emit('test');
        joe.on('test', function () { calls += 1; });
        joe.emit('test');
        assert.equal(calls, 1);
    });

    it('Unsubscribes with off', function () {
        var calls = 0;
        var listener = function () { calls += 1; };
        joe.on('test', listener);
        joe.emit('test');
        joe.off('test', listener);
        joe.emit('test');
        assert.equal(calls, 1);
    });

    it('Unsubscribes with off (all)', function () {
        var calls = 0;
        var calls2 = 0;
        var listener = function () { calls += 1; };
        var listener2 = function () { calls2 += 1; };
        joe.on('test', listener);
        joe.on('test', listener2);
        joe.emit('test');
        joe.off('test');
        joe.emit('test');
        assert.equal(calls, 1);
        assert.equal(calls2, 1);
    });

    it('Params', function () {
        var param = null;
        joe.on('test', function (p) { param = p; });
        joe.emit('test', 3);
        assert.equal(param, 3);
    });

    it('Calls correct listeners', function () {
        var calls = 0;
        var calls2 = 0;
        var listener = function () { calls += 1; };
        var listener2 = function () { calls2 += 1; };
        joe.on('test', listener);
        joe.on('test2', listener2);
        joe.emit('test');
        assert.equal(calls, 1);
        assert.equal(calls2, 0);
    });

    it('Can call off in listeners', function () {
        var calls = 0;
        var calls2 = 0;
        var listener = function () {
            calls += 1;
            joe.off('test', listener);
        };
        var listener2 = function () { calls2 += 1; };
        joe.on('test', listener);
        joe.on('test', listener2);
        joe.emit('test');
        joe.emit('test');
        assert.equal(calls, 1);
        assert.equal(calls2, 2);
    });

    it('Unsubscribes automatically with once', function () {
        var calls = 0;
        joe.once('test', function () { calls += 1; });
        joe.emit('test');
        joe.emit('test');
        assert.equal(calls, 1);
    });

    it('should inject in objects to', function () {
        var __object = {};
        eventEmitter.inject(__object);
        assert.isFunction(__object.on);
        assert.isFunction(__object.off);
        assert.isFunction(__object.emit);
        var called = false;
        __object.on('test', function () { called = true; });
        __object.emit('test');
        assert.equal(called, true);
    });

    it('is chainable', function () {
        var calls = 0;
        joe.on('test', function () { calls += 1; }).
          once('test', function () { calls += 1; });
        joe.emit('test');
        joe.emit('test');
        assert.equal(calls, 3);
    });

    describe('auto-off', function () {

        var $scopeMock;

        beforeEach(function () {
            $scopeMock = $rootScope.$new();
        });

        it('optionally accepts a $scope as the first parameter', function () {
            var called = false;
            joe.on($scopeMock, 'test', function () { called = true; });
            joe.emit('test');
            assert.equal(called, true);
        });

        it('clears listeners on $scope $destroy', function () {
            var called = false;
            joe.on($scopeMock, 'test', function () { called = true; });
            $scopeMock.$emit('$destroy');
            joe.emit('test');
            assert.equal(called, false);
        });

    });
});
