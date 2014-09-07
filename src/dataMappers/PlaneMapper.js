(function () {
    'use strict';
 
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Vector', 'common/Utils'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('../common/Vector.js'), require('../common/Utils.js'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Vector, Raceme.Common.Utils, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (Vector, Utils, env) {
        var PlaneMapper = function () {
            var mapNode = function mapNode(node) {
                return new Vector([node.x, node.y]);
            },

            mapVector = function mapVector(vector) {
                var arr;
                if (Utils.isArray(vector)) {
                    return vector.map(function(item) {
                        arr = item.toArray();
                        return {
                            x: arr[0],
                            y: arr[1]
                        };
                    });
                } else {
                    arr = vector.toArray();
                    return {
                        x: arr[0],
                        y: arr[1]
                    };
                }
            },

            getDimensions = function getDimensions() {
                return 2;
            };
 
            return {
                mapVector: mapVector,
                mapNode: mapNode,
                getDimensions: getDimensions
            };
        };
 
        // finalize the declaration
        switch(env) {
            case COMMONJS_TYPE:
                module.exports = PlaneMapper();
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.DataMappers = Raceme.DataMappers || {};
                Raceme.DataMappers.PlaneMapper = PlaneMapper();
                break;
            default:
                return PlaneMapper();
        }
    });
}());