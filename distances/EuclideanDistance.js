(function (key) {
    "use strict";
    var EuclideanDistance = function (dataExtractor) {
        /* Start private parameters and functions of the class */
        var privates = {
            dataExtractor: undefined,

            calculateDistance: function calculateDistance(node1, node2) {
                var v1 = dataExtractor.extractVector(node1).toArray(),
                    v2 = dataExtractor.extractVector(node2).toArray(),
                    sum = 0,
                    i, len;
                if (v1.length != v2.length) {
                    throw new Error('Length of vectors is not the same');
                }
                for (i = 0, len = v1.length; i < len; i += 1) {
                    sum = Math.pow(v1[i] - v2[i], 2);
                }
                return Math.sqrt(sum);
            },

            _constructor: function _constructor(dataExtractor) {
                this.dataExtractor = dataExtractor;
            }
        };
        /* End private parameters and functions of the class */

        this._ = function (aKey) {
            return key === aKey && privates;
        };
        privates._constructor();
    };

    EuclideanDistance.prototype = {
        calculateDistance: function calculateDistance() {
            return this._(key).calculateDistance();
        }
    };

    if (typeof define === 'function' && define.amd) {
        // Publish as AMD module
        define(function() {return EuclideanDistance;});
    } else if (typeof(module) != 'undefined' && module.exports) {
        // Publish as node.js module
        module.exports = EuclideanDistance;
    } else {
        // Publish as global (in browsers)
        var Raceme = Raceme || {};
        Raceme.Common = Raceme.Common || {};
        Raceme.Common.EuclideanDistance = EuclideanDistance;
    }
}({}));