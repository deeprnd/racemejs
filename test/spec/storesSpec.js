/*global describe, it, beforeEach, expect, async */
(function () {
    'use strict';
    describe('Stores', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['stores/MemoryStore', 'async'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/stores/MemoryStore.js'),
                    require('async'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Stores.MemoryStore, async);
            }
        };
        loadDependencies(function (MemoryStore, async) {
            var graph = {}, store;
            describe('MemoryStore', function () {
                beforeEach(function() {
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

                    store = new MemoryStore({ graph: graph});
                });

                it('check getCursor', function (done) {
                    store.getCursor(function (err, cursor) {
                        expect(err).toBeFalsy();
                        expect(cursor.index).toEqual(0);
                        done();
                    });
                });

                it('check getNext', function (done) {
                    store.getCursor(function (err1, cursor1) {
                        expect(err1).toBeFalsy();
                        expect(cursor1.index).toEqual(0);
                        store.getNext(cursor1, function (err2, cursor2, data) {
                            expect(err2).toBeFalsy();
                            expect(cursor1.index).toEqual(1);
                            expect(data).toEqual({
                                x: 1,
                                y: 1
                            });
                            done();
                        });
                    });
                });

                it('check end of store', function (done) {
                    store.getCursor(function (err1, cursor1) {
                        var cursor = cursor1, i = 0;
                        expect(err1).toBeFalsy();
                        async.whilst(function testCondition() {
                            return cursor;
                        }, function whilstFunc(whilstCallback) {
                            store.getNext(cursor, function (err2, _cursor, data) {
                                expect(err2).toBeFalsy();
                                expect(i).toBeLessThan(graph.nodes.length);
                                expect(data).toEqual(graph.nodes[i]);
                                i += 1;
                                cursor = _cursor;
                                whilstCallback();
                            });
                        }, function whilstResult(err) {
                            expect(err).toBeFalsy();
                            done();
                        });
                    });
                });

                it('check pickRandom', function (done) {
                    store.pickRandom(2, function (err, data) {
                        expect(err).toBeFalsy();
                        expect(data.length).toEqual(2);
                        expect(graph.nodes.filter(function(item) {
                            return item.x === data[0].x && item.y === data[0].y;
                        }).length).toEqual(1);
                        expect(graph.nodes.filter(function(item) {
                            return item.x === data[1].x && item.y === data[1].y;
                        }).length).toEqual(1);
                        done();
                    });
                });
            });
        });
    });
})();