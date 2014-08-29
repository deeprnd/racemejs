(function (key) {
    "use strict";
    var EuclideanDistance = function (dataMapper) {
        /* Start private parameters and functions of the class */
        var privates = {
            dataMapper: undefined,

            getDistance: function getDistance(node1, node2) {
                var v1 = this.dataMapper.mapVector(node1).toArray(),
                    v2 = this.dataMapper.mapVector(node2).toArray(),
                    sum = 0,
                    i,
                    len;
                if (v1.length !== v2.length) {
                    throw new Error('Length of vectors is not the same');
                }
                for (i = 0, len = v1.length; i < len; i += 1) {
                    sum = Math.pow(v1[i] - v2[i], 2);
                }
                return Math.sqrt(sum);
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

    EuclideanDistance.prototype = {
        getDistance: function getDistance() {
            return this.getPrivates(key).getDistance();
        }
    };

    if (typeof define === 'function' && define.amd) {
        // Publish as AMD module
        define(function () {return EuclideanDistance; });
    } else if (typeof(module) !== 'undefined' && module.exports) {
        // Publish as node.js module
        module.exports = EuclideanDistance;
    } else {
        // Publish as global (in browsers)
        var Raceme = Raceme || {};
        Raceme.Common = Raceme.Common || {};
        Raceme.Common.EuclideanDistance = EuclideanDistance;
    }
}({}));