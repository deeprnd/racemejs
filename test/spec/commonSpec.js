/*global describe, it, beforeEach, expect */
(function () {
    'use strict';
    describe('Common', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['common/Vector'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/common/Vector.js'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Common.Vector);
            }
        };
        loadDependencies(function (Vector) {
            var vector1, vector2;
            describe('Vector', function () {
                beforeEach(function() {
                    vector1 = new Vector([1, 2, 3]);
                    vector2 = new Vector([4, 5, 6]);
                });
                it('check length', function () {
                    expect(vector1.getLength()).toEqual(3);
                });

                it('check toArray', function () {
                    expect(vector1.toArray()).toEqual([1, 2, 3]);
                });

                it('check isEqualDimension', function () {
                    expect(vector1.isEqualDimension(vector2)).toEqual(true);
                });
            });
        });
    });
})();
