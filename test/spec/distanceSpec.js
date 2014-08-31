/*global describe, it, beforeEach, expect */
(function () {
    'use strict';
    describe('Distances', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['common/Vector', 'dataMappers/PlaneMapper', 'distances/EuclideanDistance'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/common/Vector.js'),
                    require('../../src/dataMappers/PlaneMapper.js'),
                    require('../../src/distances/EuclideanDistance.js'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Common.Vector, Raceme.DataMappers.PlaneMapper, Raceme.Distances.EuclideanDistance);
            }
        };
        loadDependencies(function (Vector, PlaneMapper, EuclideanDistance) {
            var node1, node2, measurer;
            describe('EuclideanDistance', function () {
                beforeEach(function() {
                    node1 = {
                        x: 2,
                        y: 3
                    };
                    node2 = {
                        x: -5,
                        y: 6
                    };
                    measurer = new EuclideanDistance(PlaneMapper);
                });
                it('check distance', function () {
                    //?((2 + 5)? + (3 - 6)?) = ?(49 + 9) = 7.615773105863908
                    expect(measurer.getDistance(node1, node2)).toEqual(7.6158);
                });
            });
        });
    });
})();
