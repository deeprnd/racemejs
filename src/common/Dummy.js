/*global math, _ */
(function () {
    'use strict';

    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(GLOBAL_TYPE);
        }
    };
    loadDependencies(function (env) {
        var Dummy = function () {
            return {
                isDummy: function isDummy() {
                    return true;
                }
            };
        };

        // finalize the declaration
        switch(env) {
            case COMMONJS_TYPE:
                module.exports = Dummy();
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Common = Raceme.Common || {};
                Raceme.Common.Dummy = Dummy();
                break;
            default:
                return Dummy();
        }
    });
}());