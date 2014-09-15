/*global async */
(function (key) {
    'use strict';
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Vector', 'common/Utils', 'async'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('../common/Vector.js'), require('../common/Utils.js'), require('async'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Vector, Raceme.Common.Utils, async, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (Vector, Utils, async, env) {
        var KMeans = function (dataMapper, distanceMeasurer, config) {
            /* Start private parameters and functions of the class */
            var privates = {
                distanceMeasurer: undefined,
                dataMapper: undefined,
                store: undefined,
                config: config,
                cluster: function cluster(store, callback) {
                    var dimensions = dataMapper.getDimensions(),
                        clusterNodes, // holds cluster nodes
                        closestCluster, // holds closest cluster to the node
                        clusters, // stores clusters
                        oldMeans, // stores old cluster means
                        newMeans, // stores new cluster means
                        result, // stores the final result
                        i1, len1, i2, len2, i3, item,
                        distanceMean, // computes distance of node to cluster's mean
                        getClusterMean, // gets cluster's mean
                        sumDimensions, // holds sum of each dimension
                        iterateStore,
                        processClustering;

                    distanceMean = function distanceMean(cluster, node) {
                        return privates.distanceMeasurer.getDistance(node, cluster.mean);
                    };

                    getClusterMean = function getClusterMean(item) {
                        return item.mean.toArray();
                    };

                    iterateStore = function iterateStore(cursor, iterateStoreCallback) {
                        // assign each node to closest cluster
                        var nextCursor = cursor;
                        async.whilst(function testCondition() {
                            return nextCursor;
                        }, function whilstFunc(whileCallback) {
                            store.getNext(nextCursor, function getNextHandler(err, _cursor, data) {
                                if (err) {
                                    whileCallback(err);
                                } else {
                                    item = privates.dataMapper.mapNode(data);
                                    nextCursor = _cursor;

                                    closestCluster = Utils.min(clusters, item, distanceMean);
                                    closestCluster.nodes.push(item);
                                    whileCallback(null);
                                }
                            });
                        }, function whilstResult() {
                            // recalculate means of each cluster
                            for (i1 = 0, len1 = clusters.length; i1 < len1; i1 += 1) {
                                clusterNodes = clusters[i1].nodes;

                                // zero sumDimensions see: http://jsperf.com/zero-filled-array-creation
                                for (i2 = 0, sumDimensions = new Array(dimensions); i2 < dimensions; i2 += 1) {
                                    sumDimensions[i2] = 0;
                                }

                                // calculate mean#1: sum by vectors
                                for (i2 = 0, len2 = clusterNodes.length; i2 < len2; i2 += 1) {
                                    item = clusterNodes[i2].toArray();
                                    for (i3 = 0; i3 < dimensions; i3 += 1) {
                                        sumDimensions[i3] += item[i3];
                                    }
                                }

                                // calculate mean#2: divide by num
                                for (i3 = 0; i3 < dimensions; i3 += 1) {
                                    sumDimensions[i3] = Utils.round(sumDimensions[i3] / len2, 4);
                                }
                                clusters[i1].mean = new Vector(sumDimensions);
                            }

                            newMeans = clusters.map(getClusterMean);
                            iterateStoreCallback();
                        });
                    };

                    processClustering = function processClustering() {
                        async.doWhilst(function doWhilstFunc(whileCallback) {
                            if (newMeans) {
                                oldMeans = newMeans;
                            } else {
                                oldMeans = clusters.map(getClusterMean);
                            }

                            // clear clusters
                            for (i1 = 0, len1 = clusters.length; i1 < len1; i1 += 1) {
                                clusters[i1].nodes = [];
                            }

                            store.getCursor(function getCursorHandler(err, cursor) {
                                if (err) {
                                    whileCallback(err);
                                } else {
                                    iterateStore(cursor, whileCallback);
                                }
                            });
                        }, function testCondition() {
                            return !Utils.isEqual(newMeans, oldMeans);
                        }, function doWhilstResult(err) {
                            if (err) {
                                callback(err);
                            } else {
                                result = clusters.map(function (item) {
                                    return {
                                        nodes: privates.dataMapper.mapVector(item.nodes)
                                    };
                                });
                                callback(null, result);
                            }
                        });
                    };

                    // pick k random means and start the iteration
                    store.pickRandom(config.k, function (err, items) {
                        if (err) {
                            callback(err);
                        } else {
                            clusters = items.map(function(item, index) {
                                return {
                                    mean: privates.dataMapper.mapNode(item),
                                    nodes: [],
                                    index: index
                                };
                            });
                            processClustering();
                        }
                    });
                },

                _constructor: function _constructor(dataMapper, distanceMeasurer, config) {
                    privates.distanceMeasurer = distanceMeasurer;
                    privates.dataMapper = dataMapper;
                    privates.config = config;
                }
            };
            /* End private parameters and functions of the class */

            this.getPrivates = function getPrivates(aKey) {
                return key === aKey && privates;
            };
            privates._constructor(dataMapper, distanceMeasurer, config);
        };

        KMeans.prototype = {
            cluster: function cluster(store, callback) {
                return this.getPrivates(key).cluster(store, callback);
            }
        };

        // finalize the declaration
        switch (env) {
            case COMMONJS_TYPE:
                module.exports = KMeans;
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Algorithms = Raceme.Algorithms || {};
                Raceme.Algorithms.KMeans = KMeans;
                break;
            default:
                return KMeans;
        }
    });
}({}));