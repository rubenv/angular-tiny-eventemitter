describe('EventEmitter', function () {
    var eventEmitter = null;
    var Person = null;
    var joe = null;

    beforeEach(module('rt.eventemitter'));

    beforeEach(inject(function ($injector) {
        eventEmitter = $injector.get('eventEmitter');
        Person = function Person() {};
        eventEmitter.inject(Person);
        joe = new Person();
    }));

    it('Has an inject function', function () {
        assert.isFunction(eventEmitter.inject);
    });

    it('Injects event methods on the class', function () {
        assert.isFunction(joe.on);
        assert.isFunction(joe.off);
        assert.isFunction(joe.emit);
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
});
