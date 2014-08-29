(function () {
    'use strict';

    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Vector'], callback);
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('../common/Vector.js'), 2);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Vector, 3);
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

        switch(env) {
            case 2:
                module.exports = PlaneMapper();
                break;
            case 3:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.DataMappers = Raceme.DataMappers || {};
                Raceme.DataMappers.PlaneMapper = PlaneMapper();
                break;
            default:
                return PlaneMapper();
        }
    });
}());