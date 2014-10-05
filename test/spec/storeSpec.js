/*global describe, it, beforeEach, expect, async, jasmine */
(function () {
    'use strict';
    describe('Stores', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['stores/MemoryStore', 'stores/RedisStore', 'async'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/stores/MemoryStore.js'),
                    require('../../src/stores/RedisStore.js'),
                    require('async'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Stores.MemoryStore, Raceme.Stores.RedisStore, async);
            }
        };
        loadDependencies(function (MemoryStore, RedisStore, async) {
            var store, graph = {
                    nodes: [
                        {
                            x: 1,
                            y: 1
                        },
                        {
                            x: 1.5,
                            y: 2
                        },
                        {
                            x: 3,
                            y: 4
                        },
                        {
                            x: 5,
                            y: 7
                        },
                        {
                            x: 3.5,
                            y: 5
                        },
                        {
                            x: 4.5,
                            y: 5
                        },
                        {
                            x: 3.5,
                            y: 4.5
                        }
                    ]
                }, test = function test(suite, store) {
                    describe(suite, function () {
                        describe('init', function () {
                            var _err;
                            beforeEach(function (done) {
                                store.init(function (err) {
                                    _err = err;
                                    done();
                                });
                            });

                            it('check init', function () {
                                expect(_err).toBeFalsy();
                            });
                        });

                        describe('purge', function () {
                            it('check purge', function (done) {
                                store.purge(function (err) {
                                    expect(err).toBeFalsy();
                                    if (!err) {
                                        store.getCursor(function (err, cursor) {
                                            expect(err).toBeFalsy();
                                            if (!err) {
                                                expect(cursor.index).toEqual(0);
                                                store.getNext(cursor, function (err2, cursor2, data) {
                                                    expect(err2).toBeFalsy();
                                                    if (!err2) {
                                                        expect(store.isEnd(cursor2)).toBeTruthy();
                                                    }
                                                    done();
                                                });
                                            } else {
                                                done();
                                            }
                                        });
                                    } else {
                                        done();
                                    }
                                });
                            });
                        });

                        describe('set', function () {
                            var _err;
                            beforeEach(function (done) {
                                var i = 0;
                                async.eachSeries(graph.nodes, function iterator(item, innerCallback) {
                                    store.set((i += 1), item, innerCallback);
                                }, function (err) {
                                    _err = err;
                                    done();
                                });
                            });

                            it('check set', function () {
                                expect(_err).toBeFalsy();
                            });
                        });

                        describe('rest', function () {
                            var _err, cursor;
                            beforeEach(function (done) {
                                store.getCursor(function (err, _cursor) {
                                    _err = err;
                                    cursor = _cursor;
                                    done();
                                });
                            });

                            it('check getCursor', function () {
                                expect(_err).toBeFalsy();
                                if (!_err) {
                                    expect(cursor.index).toEqual(0);
                                }
                            });

                            it('check getNext', function (done) {
                                store.getNext(cursor, function (err, cursor1, data) {
                                    expect(err).toBeFalsy();
                                    if (!err) {
                                        expect(cursor1.index).toEqual(1);
                                        expect(data).toEqual({
                                            x: 1,
                                            y: 1
                                        });
                                    }
                                    done();
                                });
                            });

                            it('check end of store', function (done) {
                                store.getCursor(function (err1, cursor1) {
                                    var cursor = cursor1, i = 0;
                                    expect(err1).toBeFalsy();
                                    async.whilst(function testCondition() {
                                        return !store.isEnd(cursor);
                                    }, function whilstFunc(whilstCallback) {
                                        store.getNext(cursor, function (err2, _cursor, data) {
                                            expect(err2).toBeFalsy();
                                            if (!err2) {
                                                expect(i).toBeLessThan(graph.nodes.length);
                                                expect(data).toEqual(graph.nodes[i]);
                                                i += 1;
                                                cursor = _cursor;
                                            }
                                            whilstCallback();
                                        });
                                    }, function whilstResult(err) {
                                        expect(err).toBeFalsy();
                                        done();
                                    });
                                });
                            });

                            describe('check pickRandom', function () {

                                beforeEach(function() {
                                    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                                });

                                it('check few', function (done) {
                                    var len = 2, i, data, filterFunc = function (item) {
                                        return item.x === data[i].x && item.y === data[i].y;
                                    };
                                    store.pickRandom(len, function (err, _data) {
                                        data = _data;
                                        expect(err).toBeFalsy();
                                        if (!err) {
                                            expect(data.length).toEqual(len);

                                            for (i = 0; i < len; i += 1) {
                                                expect(graph.nodes.filter(filterFunc).length).toEqual(1);
                                            }
                                        }
                                        done();
                                    });
                                });

                                it('check full length', function (done) {
                                    var len = graph.nodes.length, i, data, filterFunc = function (item) {
                                        return item.x === data[i].x && item.y === data[i].y;
                                    };
                                    store.pickRandom(len, function (err, _data) {
                                        if (err) {
                                            expect(err).toBeTruthy(); // also ok, since only memorystore usually succeeds
                                        } else {
                                            expect(err).toBeFalsy();
                                            expect(_data.length).toEqual(len);
                                            data = _data;

                                            for (i = 0; i < len; i += 1) {
                                                expect(graph.nodes.filter(filterFunc).length).toEqual(1);
                                            }
                                        }
                                        done();
                                    });
                                });

                                it('check with k>n length', function (done) {
                                    var len = graph.nodes.length + 1;
                                    store.pickRandom(len, function (err) {
                                        expect(err).toBeTruthy();
                                        done();
                                    });
                                });
                            });
                        });
                    });
                };

            test('MemoryStore', new MemoryStore({ graph: { nodes: []}}));
            store = new RedisStore({ domain: 'pub-redis-10331.us-east-1-4.1.ec2.garantiadata.com', port: 10331, password: '1qaz@WSX' });
            if (store.isDummy()) {
                describe('RedisStore', function() {
                    it('is dummy', function () {
                        expect(true).toBeTruthy();
                    });
                });
            } else {
                test('RedisStore', store);
            }
        });
    });
})();