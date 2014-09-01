(function (key) {
    'use strict';
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['mathjs'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('mathjs'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(math, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (math, env) {
        var WardDistance = function (dataMapper) {
            /* Start private parameters and functions of the class */
            var privates = {
                dataMapper: undefined,

                getDistance: function getDistance(node1, node2) {
                    var v1 = this.dataMapper.mapVector(node1).toArray(),
                        v2 = this.dataMapper.mapVector(node2).toArray(),
                        sum = 0, i, len;
                    if (v1.length !== v2.length) {
                        throw new Error('Length of vectors is not the same');
                    }
                    for (i = 0, len = v1.length; i < len; i += 1) {
                        sum += math.pow(v1[i] - v2[i], 2);
                    }
                    return math.round(sum, 4);
                },

                _constructor: function _constructor(dataMapper) {
                    this.dataMapper = dataMapper;
                }
            };
            /* End private parameters and functions of the class */

            this.getPrivates = function getPrivates(aKey) {
                return key === aKey && privates;
            };
            privates._constructor(dataMapper);
        };

        WardDistance.prototype = {
            getDistance: function getDistance(node1, node2) {
                return this.getPrivates(key).getDistance(node1, node2);
            }
        };

        // finalize the declaration
        switch (env) {
            case COMMONJS_TYPE:
                module.exports = WardDistance;
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Distances = Raceme.Distances || {};
                Raceme.Distances.WardDistance = WardDistance;
                break;
            default:
                return WardDistance;
        }
    });
}({}));