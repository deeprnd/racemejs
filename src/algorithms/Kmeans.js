(function (key) {
    'use strict';
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Utils', 'common/Vector'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('../common/Utils.js'), require('../common/Vector.js'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Utils, Raceme.Common.Vector, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (Utils, Vector, env) {
        var Kmeans = function (dataMapper, distanceMeasurer, config) {
            /* Start private parameters and functions of the class */
            var privates = {
                distanceMeasurer: undefined,
                dataMapper: undefined,
                config: config,
                cluster: function cluster(graph) {
                    var dimensions = dataMapper.getDimensions(),
                        graphNodes, // holds graph nodes as vectors
                        clusterNodes, // holds cluster nodes
                        closestCluster, // holds closest cluster to the node
                        clusters, // stores clusters
                        oldMeans, // stores old cluster means
                        newMeans, // stores new cluster means
                        i1, len1, i2, len2, i3,
                        distanceMean, // computes distance of node to cluster's mean
                        getClusterMean, // gets cluster's mean
                        item, // temp vector/node
                        sumDimensions; // holds sum of each dimension

                    graphNodes =  graph.nodes.map(function (item) {
                        return privates.dataMapper.mapNode(item);
                    });

                    distanceMean = function distanceMean(cluster, node) {
                        return privates.distanceMeasurer.getDistance(node, cluster.mean);
                    };

                    getClusterMean = function getClusterMean(item) {
                        return item.mean.toArray();
                    };

                    clusters = Utils.pickRandom(graphNodes, config.k).map(function(item, index) {
                        return {
                            mean: item,
                            nodes: [],
                            index: index
                        };
                    });

                    do {
                        if (newMeans) {
                            oldMeans = newMeans;
                        } else {
                            oldMeans = clusters.map(getClusterMean);
                        }

                        for (i1 = 0, len1 = clusters.length; i1 < len1; i1 += 1) {
                            clusters[i1].nodes = [];
                        }

                        // assign each node to closest cluster
                        for (i1 = 0, len1 = graphNodes.length; i1 < len1; i1 += 1) {
                            item = graphNodes[i1];
                            closestCluster = Utils.min(clusters, item, distanceMean);
                            closestCluster.nodes.push(item);
                        }

                        // recalculate means of each cluster
                        for (i1 = 0, len1 = clusters.length; i1 < len1; i1 += 1) {
                            clusterNodes = clusters[i1].nodes;

                            // zero sumDimensions see: http://jsperf.com/zero-filled-array-creation
                            for (i2 = 0, sumDimensions = new Array(dimensions); i2 < dimensions; i2 += 1) {
                                sumDimensions[i2] = 0;
                            }

                            // calculate mean#1: sum by vectors
                            for (i2 = 0, len2 = clusterNodes.length; i2 < len2; i2 +=1) {
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
                    } while(!Utils.isEqual(newMeans, oldMeans));

                    return clusters.map(function(item) {
                        return {
                            nodes: privates.dataMapper.mapVector(item.nodes)
                        };
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

        Kmeans.prototype = {
            cluster: function cluster(graph) {
                return this.getPrivates(key).cluster(graph);
            }
        };

        // finalize the declaration
        switch (env) {
            case COMMONJS_TYPE:
                module.exports = Kmeans;
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Algorithms = Raceme.Algorithms || {};
                Raceme.Algorithms.Kmeans = Kmeans;
                break;
            default:
                return Kmeans;
        }
    });
}({}));