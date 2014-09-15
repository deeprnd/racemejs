/*global describe, it, beforeEach, afterEach, expect */
(function () {
    'use strict';
    describe('Algorithms', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['common/Vector', 'dataMappers/PlaneMapper',
                    'distances/EuclideanDistance', 'stores/MemoryStore', 'algorithms/KMeans', 'common/Utils'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/common/Vector.js'),
                    require('../../src/dataMappers/PlaneMapper.js'),
                    require('../../src/distances/EuclideanDistance.js'),
                    require('../../src/stores/MemoryStore.js'),
                    require('../../src/algorithms/KMeans.js'),
                    require('../../src/common/Utils.js'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Common.Vector, Raceme.DataMappers.PlaneMapper,
                    Raceme.Distances.EuclideanDistance, Raceme.Stores.MemoryStore,
                    Raceme.Algorithms.KMeans, Raceme.Common.Utils);
            }
        };
        loadDependencies(function (Vector, PlaneMapper, EuclideanDistance, MemoryStore, KMeans, Utils) {
            var graph = {}, store, algorithm, k = 2, pickRandom;
            describe('K-means', function () {
                beforeEach(function() {
                    algorithm = new KMeans(PlaneMapper, new EuclideanDistance(), {
                        k: k
                    });
                    graph.nodes = [{
                        x: 1,
                        y: 1
                    },{
                        x: 1.5,
                        y: 2
                    },{
                        x: 3,
                        y: 4
                    },{
                        x: 5,
                        y: 7
                    },{
                        x: 3.5,
                        y: 5
                    },{
                        x: 4.5,
                        y: 5
                    },{
                        x: 3.5,
                        y: 4.5
                    }];

                    store = new MemoryStore({ graph: graph });
                    pickRandom =  Utils.pickRandom;

                    Utils.pickRandom = function pickRandom(list, num) {
                        var len, i, result = [];
                        if (num === undefined) {
                            throw new Error('Stub does not support not capped random picking');
                        }
                        len = list.length;
                        if (num >= len) {
                            return list;
                        }
                        for (i = 0; i < num; i += 1) {
                            result.push(list[i]);
                        }
                        return result;
                    };
                });

                afterEach(function() {
                    Utils.pickRandom = pickRandom;
                });

                it('check number of clusters', function (done) {
                    algorithm.cluster(store, function clusterHandler(err, clusters) {
                        expect(clusters.length).toEqual(k);
                        done();
                    });
                });

                /*it('check number of clusters distribution', function () {
                    var clusters = algorithm.cluster(graph);
                    expect(clusters[0].nodes.length).toEqual(2);
                    expect(clusters[1].nodes.length).toEqual(5);
                });

                it('check number of clusters content', function () {
                    var clusters = algorithm.cluster(graph);
                    expect(clusters[0].nodes).toEqual([{
                        x: 1,
                        y: 1
                    }, {
                        x: 1.5,
                        y: 2
                    }]);
                });*/
            });
        });
    });
})();