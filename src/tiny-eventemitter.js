angular.module('rt.eventemitter', []).factory('eventEmitter', function () {
    var key = '_listeners';

    function on(event, fn) {
        if (!this[key]) {
            this[key] = {};
        }

        var events = this[key];
        if (!events[event]) {
            events[event] = [];
        }

        events[event].push(fn);
    }

    function once(event, fn) {
        var self = this;
        var cb = function () {
            fn.apply(this, arguments);
            self.off(event, cb);
        };

        this.on(event, cb);
    }

    function off(event, fn) {
        if (!this[key] || !this[key][event]) {
            return;
        }

        var events = this[key];
        if (!fn) {
            delete events[event];
        } else {
            var listeners = events[event];
            var index = listeners.indexOf(fn);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    function emit(event) {
        if (!this[key] || !this[key][event]) {
            return;
        }

        // Making a copy here to allow `off` in listeners.
        var listeners = this[key][event].slice(0);
        var params = [].slice.call(arguments, 1);
        for (var i = 0; i < listeners.length; i++) {
            listeners[i].apply(null, params);
        }
    }

    return {
        inject: function (cls) {
            var proto = cls.prototype;
            proto.on = on;
            proto.once = once;
            proto.off = off;
            proto.emit = emit;
        }
    };
});
