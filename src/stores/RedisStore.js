/*global async */
(function (key) {
    'use strict';
    var COMMONJS_TYPE = 2, GLOBAL_TYPE = 3;
    var loadDependencies = function loadDependencies(callback) {
        if (typeof define === 'function' && define.amd) {
            // define AMD module with dependencies
            define(['common/Dummy', 'common/Utils', 'async'], callback); // cannot pass env type
        } else if (typeof(module) !== 'undefined' && module.exports) {
            // load CommonJS module
            callback(require('redis'), require('../common/Utils.js'), require('async'), COMMONJS_TYPE);
        } else {
            // Publish as global (in browsers)
            callback(Raceme.Common.Dummy, Raceme.Common.Utils, async, GLOBAL_TYPE);
        }
    };
    loadDependencies(function (redis, Utils, async, env) {
        var RedisStore = function (config) {
            /* Start private parameters and functions of the class */
            var privates = {
                config: undefined,
                getNext: function getNext(cursor, callback) {
                    privates.callback = callback;
                    if (cursor.keys.length > 0 && cursor.index < cursor.keys.length) {
                        // get data by key
                        privates.client.get(cursor.keys[cursor.index], function onGet(err, data) {
                            if (err) {
                                callback(err);
                            } else {
                                cursor.index += 1;
                                callback(null, cursor, data);
                            }
                        });
                    } else {
                        // get next cursor
                        privates.client.scan(cursor.cursor, function innerCallback(err, keys) {
                            if (err) {
                                return callback(err);
                            }
                            if (keys instanceof Array && keys.length !== 2) {
                                return callback(new Error('Wrong result from the server: ' + JSON.stringify(keys)));
                            }

                            cursor.cursor = keys[0];
                            cursor.index = 0;
                            cursor.keys = keys[1];

                            // get data by key
                            privates.client.get(cursor.keys[cursor.index], function onGet(err, data) {
                                if (err) {
                                    return callback(err);
                                }
                                cursor.index += 1;
                                callback(null, cursor, JSON.parse(data));
                            });
                        });
                    }
                },

                isEnd: function isEnd(cursor) {
                    return !((cursor.keys.length > 0 && cursor.index < cursor.keys.length) || cursor.cursor !== '0');
                },

                getCursor: function getCursor(callback) {
                    callback(null, { cursor: '0', keys: [], index: 0 });
                },

                set: function set(key, value, callback) {
                    privates.callback = callback;
                    privates.client.set(key, JSON.stringify(value), callback);
                },

                pickRandom: function pickRandom(count, callback) {
                    var keys = [], i = count * 3; // x3 attempts

                    async.whilst(function testCondition() {
                        return keys.length < count && (i-=1) >= 0; // while don't have enough keys or too many attempts
                    }, function whilstFunc(whilstCallback) {
                        privates.client.randomkey(function randomKeyHandler(err, key) { // get random key
                            if (err) {
                                return whilstCallback(err);
                            }

                            keys.push(key);
                            keys = Utils.unique(keys);
                            whilstCallback();
                        });
                    }, function whilstResult(err) {
                        if (err) {
                            return callback(err);
                        }

                        if (i <= 0) {
                            return callback(new Error('Couldn\'t find ' + count + ' unique keys'));
                        }

                        // get values according to keys
                        async.map(keys, function iterator(item, innerCallback) {
                            privates.client.get(item, function getHandler(err, data) {
                                if (err) {
                                    return innerCallback(err);
                                }
                                innerCallback(null, JSON.parse(data));
                            });
                        }, callback);
                    });
                },

                init: function init(callback) {
                    privates.client = redis.createClient(privates.config.port, privates.config.domain, privates.config);
                    privates.client.on('error', function onError(err) {
                        if (privates.callback) {
                            return privates.callback(err);
                        }
                        throw err;
                    });
                    privates.callback = callback;
                    privates.client.auth(privates.config.password, function onAuth() {
                        privates.callback = null;
                        callback();
                    });
                },

                destroy: function destroy(callback) {
                    privates.callback = callback;
                    privates.client.end();
                    callback();
                },

                purge: function purge(callback) {
                    privates.callback = callback;
                    privates.client.flushdb(callback);
                },

                isDummy: function isDummy() {
                    return !!redis.isDummy;
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

        RedisStore.prototype = {
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
            set: function set(_key, value, callback) {
                return this.getPrivates(key).set(_key, value, callback);
            },
            destroy: function destroy(callback) {
                return this.getPrivates(key).destroy(callback);
            },
            purge: function purge(callback) {
                return this.getPrivates(key).purge(callback);
            },
            isEnd: function isEnd(cursor, callback) {
                return this.getPrivates(key).isEnd(cursor, callback);
            },
            isDummy: function isDummy(callback) {
                return this.getPrivates(key).isDummy(callback);
            }
        };

        // finalize the declaration
        switch (env) {
            case COMMONJS_TYPE:
                module.exports = RedisStore;
                break;
            case GLOBAL_TYPE:
                var Raceme = window.Raceme = window.Raceme || {};
                Raceme.Stores = Raceme.Stores || {};
                Raceme.Stores.RedisStore = RedisStore;
                break;
            default:
                return RedisStore;
        }
    });
}({}));