(function (key) {
    'use strict';
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Utils'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('../common/Utils.js'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Utils, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (Utils, env) {
        var EuclideanDistance = function () {
            /* Start private parameters and functions of the class */
            var privates = {
                getDistance: function getDistance(node1, node2) {
                    var v1 = node1.toArray(),
                        v2 = node2.toArray(),
                        sum = 0, i, len;
                    if (v1.length !== v2.length) {
                        throw new Error('Length of vectors is not the same');
                    }
                    for (i = 0, len = v1.length; i < len; i += 1) {
                        sum += Utils.pow(v1[i] - v2[i], 2);
                    }
                    return Utils.round(Utils.sqrt(sum), 4);
                }
            };
            /* End private parameters and functions of the class */

            this.getPrivates = function getPrivates(aKey) {
                return key === aKey && privates;
            };
        };

        EuclideanDistance.prototype = {
            getDistance: function getDistance(node1, node2) {
                return this.getPrivates(key).getDistance(node1, node2);
            }
        };

        // finalize the declaration
        switch (env) {
            case COMMONJS_TYPE:
                module.exports = EuclideanDistance;
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Distances = Raceme.Distances || {};
                Raceme.Distances.EuclideanDistance = EuclideanDistance;
                break;
            default:
                return EuclideanDistance;
        }
    });
}({}));