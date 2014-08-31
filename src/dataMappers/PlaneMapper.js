(function () {
    'use strict';
 
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Vector'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('../common/Vector.js'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Vector, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (Vector, env) {
        var PlaneMapper = function () {
            var mapVector = function mapVector(node) {
                return new Vector([node.x, node.y]);
            };
 
            return {
                mapVector: mapVector
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