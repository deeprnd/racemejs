(function () {
    'use strict';

    var Vector = function Vector(v) {
        var vector = v;

        this.getLength = function getLength() {
            return vector.length;
        };

        this.toArray = function toArray() {
            return vector;
        };

        this.isEqualDimension = function isEqualDimension(v) {
            return v.getLength() === this.getLength();
        };
    };

    if (typeof define === 'function' && define.amd) {
        // Publish as AMD module
        define(function() {return Vector;});
    } else if (typeof(module) !== 'undefined' && module.exports) {
        // Publish as node.js module
        module.exports = Vector;
    } else {
        // Publish as global (in browsers)
        var Raceme = window.Raceme = window.Raceme || {};
        Raceme.Common = Raceme.Common || {};
        Raceme.Common.Vector = Vector;
    }
}());