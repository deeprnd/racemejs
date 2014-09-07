/*global math, _ */
(function () {
    'use strict';

    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['mathjs', 'lodash'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('mathjs'), require('lodash'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(math, _, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (math, _, env) {
        var Utils = function () {
            var pickRandom = function pickRandom(list, num) {
                var len, i, result = [], indices;
                if (num === undefined) {
                    return math.pickRandom(list);
                }
                len = list.length;
                if (num >= len) {
                    return list;
                }
                indices = _.shuffle(_.range(len));
                for (i = 0; i < num; i += 1) {
                    result.push(list[indices[i]]);
                }
                return result;
            },

            min = function min(list, state, accessor) {
                var i, len, value, minValue = Number.MAX_VALUE, minIndex = -1;
                if (!accessor) {
                    return math.min(list);
                }

                for (i = 0, len = list.length; i < len; i += 1) {
                    value = accessor(list[i], state);
                    if (value < minValue) {
                        minValue = value;
                        minIndex = i;
                    }
                }
                return list[minIndex];
            },

            isEqual = function isEqual(obj1, obj2) {
                var i, len, isOk = 1;
                if (_.isArray(obj1)) {
                    for(i = 0, len = obj1.length; isOk && i < len; i += 1) {
                        isOk &= _.isEqual(obj1[i], obj2[i]);
                    }
                    return isOk === 1;
                }

                return _.isEqual(obj1, obj2);
            };

            return {
                pow: math.pow,
                sqrt: math.sqrt,
                round: math.round,
                abs: math.abs,
                pickRandom: pickRandom,
                min: min,
                isEqual: isEqual,
                isArray: _.isArray
            };
        };

        // finalize the declaration
        switch(env) {
            case COMMONJS_TYPE:
                module.exports = Utils();
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Common = Raceme.Common || {};
                Raceme.Common.Utils = Utils();
                break;
            default:
                return Utils();
        }
    });
}());