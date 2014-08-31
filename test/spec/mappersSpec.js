/*global describe, it, beforeEach, expect */
(function () {
    'use strict';
    describe('Mappers', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['common/Vector', 'dataMappers/PlaneMapper'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/common/Vector.js'), require('../../src/dataMappers/PlaneMapper.js'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Common.Vector, Raceme.DataMappers.PlaneMapper);
            }
        };
        loadDependencies(function (Vector, PlaneMapper) {
            var vector;
            describe('PlaneMapper', function () {
                var mapper, node;
                beforeEach(function() {
                    mapper = PlaneMapper;
                    node = {
                        x: 5,
                        y: 10
                    };
                });
                it('check mapping', function () {
                    vector = mapper.mapVector(node);
                    expect(vector.toArray()).toEqual([5, 10]);
                });
            });
        });
    });
})();
