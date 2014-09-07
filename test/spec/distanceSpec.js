/*global describe, it, beforeEach, expect */
(function () {
    'use strict';
    describe('Distances', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['common/Vector', 'dataMappers/PlaneMapper',
                    'distances/EuclideanDistance', 'distances/ManhattanDistance',
                    'distances/WardDistance'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/common/Vector.js'),
                    require('../../src/dataMappers/PlaneMapper.js'),
                    require('../../src/distances/EuclideanDistance.js'),
                    require('../../src/distances/ManhattanDistance.js'),
                    require('../../src/distances/WardDistance.js'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Common.Vector, Raceme.DataMappers.PlaneMapper,
                    Raceme.Distances.EuclideanDistance, Raceme.Distances.ManhattanDistance,
                    Raceme.Distances.WardDistance);
            }
        };
        loadDependencies(function (Vector, PlaneMapper, EuclideanDistance, ManhattanDistance, WardDistance) {
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
                    measurer = new EuclideanDistance();
                });
                it('check distance', function () {
                    //?((2 + 5)? + (3 - 6)?) = ?(49 + 9) = 7.615773105863908
                    expect(measurer.getDistance(PlaneMapper.mapNode(node1), PlaneMapper.mapNode(node2))).toEqual(7.6158);
                });
            });

            describe('ManhattanDistance', function () {
                beforeEach(function() {
                    node1 = {
                        x: 2,
                        y: 3
                    };
                    node2 = {
                        x: -5,
                        y: 6
                    };
                    measurer = new ManhattanDistance();
                });
                it('check distance', function () {
                    //|2 + 5| + |3 - 6| = (7 + 3) = 10
                    expect(measurer.getDistance(PlaneMapper.mapNode(node1), PlaneMapper.mapNode(node2))).toEqual(10);
                });
            });

            describe('WardDistance', function () {
                beforeEach(function() {
                    node1 = {
                        x: 2,
                        y: 3
                    };
                    node2 = {
                        x: -5,
                        y: 6
                    };
                    measurer = new WardDistance(PlaneMapper);
                });
                it('check distance', function () {
                    //((2 + 5)? + (3 - 6)?) = (49 + 9) = 58
                    expect(measurer.getDistance(PlaneMapper.mapNode(node1), PlaneMapper.mapNode(node2))).toEqual(58);
                });
            });
        });
    });
})();
