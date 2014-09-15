(function (key) {
    'use strict';
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Utils'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('../common/Utils.js'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Utils, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (Utils, env) {
        var MemoryStore = function (config) {
            /* Start private parameters and functions of the class */
            var privates = {
                config: undefined,
                getNext: function getNext(cursor, callback) {
                    var index;
                    if (cursor.index >= config.graph.nodes.length) {
                        callback(null, null);
                    } else {
                        index = cursor.index;
                        cursor.index += 1;
                        if (cursor.index >= config.graph.nodes.length) {
                            cursor = null;
                        }
                        callback(null, cursor, config.graph.nodes[index]);
                    }
                },

                getCursor: function getCursor(callback) {
                    callback(null, { index: 0 });
                },

                pickRandom: function pickRandom(count, callback) {
                    callback(null, Utils.pickRandom(config.graph.nodes, count));
                },

                init: function init(callback) {
                    callback();
                },

                destroy: function destroy(callback) {
                    callback();
                },

                purge: function purge(callback) {
                    config.graph.nodes = [];
                    config.graph.edges = [];
                    callback();
                },

                onError: function onError() {
                    'nothing';
                },

                _constructor: function _constructor(config) {
                    privates.config = config;
                }
            };
            /* End private parameters and functions of the class */

            this.getPrivates = function getPrivates(aKey) {
                return key === aKey && privates;
            };
            privates._constructor(config);
        };

        MemoryStore.prototype = {
            getNext: function getNext(cursor, callback) {
                return this.getPrivates(key).getNext(cursor, callback);
            },
            getCursor: function getCursor(callback) {
                return this.getPrivates(key).getCursor(callback);
            },
            pickRandom: function pickRandom(count, callback) {
                return this.getPrivates(key).pickRandom(count, callback);
            },
            init: function init(callback) {
                return this.getPrivates(key).init(callback);
            },
            destroy: function destroy(callback) {
                return this.getPrivates(key).destroy(callback);
            },
            onError: function onError(callback) {
                return this.getPrivates(key).onError(callback);
            },
            purge: function purge(callback) {
                return this.getPrivates(key).purge(callback);
            }
        };

        // finalize the declaration
        switch (env) {
            case COMMONJS_TYPE:
                module.exports = MemoryStore;
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Stores = Raceme.Stores || {};
                Raceme.Stores.MemoryStore = MemoryStore;
                break;
            default:
                return MemoryStore;
        }
    });
}({}));