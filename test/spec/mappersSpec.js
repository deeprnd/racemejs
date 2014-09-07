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
            describe('PlaneMapper', function () {
                var mapper, node, vector;
                beforeEach(function() {
                    mapper = PlaneMapper;
                    node = {
                        x: 5,
                        y: 10
                    };
                    vector = new Vector([5, 10]);
                });
                it('check map node', function () {
                    expect(mapper.mapNode(node).toArray()).toEqual([5, 10]);
                });

                it('check map vector object', function () {
                    expect(mapper.mapVector(vector)).toEqual(node);
                });

                it('check map vector array', function () {
                    var vectors = [new Vector([1,2]),new Vector([3,4])];
                    expect(mapper.mapVector(vectors)).toEqual([{
                        x: 1,
                        y: 2
                    }, {
                        x: 3,
                        y: 4
                    }]);
                });
            });
        });
    });
})();
