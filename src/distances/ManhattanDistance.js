(function (key) {
    "use strict";
    var ManhattanDistance = function (dataExtractor) {
        /* Start private parameters and functions of the class */
        var privates = {
            dataExtractor: undefined,

            calculateDistance: function calculateDistance(node1, node2) {
                var v1 = dataExtractor.extractVector(node1).toArray(),
                    v2 = dataExtractor.extractVector(node2).toArray(),
                    sum = 0,
                    i,
                    len;
                if (v1.length !== v2.length) {
                    throw new Error('Length of vectors is not the same');
                }
                for (i = 0, len = v1.length; i < len; i += 1) {
                    sum = Math.abs(v1[i] - v2[i]);
                }
                return sum;
            },

            _constructor: function _constructor(dataExtractor) {
                this.dataExtractor = dataExtractor;
            }
        };
        /* End private parameters and functions of the class */

        this.getPrivates = function getPrivates(aKey) {
            return key === aKey && privates;
        };
        privates._constructor(dataExtractor);
    };

    ManhattanDistance.prototype = {
        calculateDistance: function calculateDistance() {
            return this.getPrivates(key).calculateDistance();
        }
    };

    if (typeof define === 'function' && define.amd) {
        // Publish as AMD module
        define(function () {return ManhattanDistance; });
    } else if (typeof(module) !== 'undefined' && module.exports) {
        // Publish as node.js module
        module.exports = ManhattanDistance;
    } else {
        // Publish as global (in browsers)
        var Raceme = Raceme || {};
        Raceme.Common = Raceme.Common || {};
        Raceme.Common.ManhattanDistance = ManhattanDistance;
    }
}({}));