/*global describe, it, beforeEach, expect */
(function () {
    'use strict';
    describe('Mappers', function () {
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
            var vector;
            describe('Vector', function () {
                beforeEach(function() {
                    vector = new Vector([1, 2, 3]);
                });
                it('check length', function () {
                    expect(vector.length()).toEqual(3);
                });

                it('check toArray', function () {
                    expect(vector.toArray()).toEqual([1, 2, 3]);
                });
            });
        });
    });
})();
