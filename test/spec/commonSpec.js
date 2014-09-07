/*global describe, it, beforeEach, expect */
(function () {
    'use strict';
    describe('Common', function () {
        var loadDependencies = function loadDependencies(callback) {
            if (typeof define === 'function' && define.amd) {
                // load AMD module
                define(['common/Vector', 'common/Utils'], callback);
            } else if (typeof(module) !== 'undefined' && module.exports) {
                // load CommonJS module
                callback(require('../../src/common/Vector.js'), require('../../src/common/Utils.js'));
            } else {
                // Publish as global (in browsers)
                callback(Raceme.Common.Vector, Raceme.Common.Utils);
            }
        };
        loadDependencies(function (Vector, Utils) {
            var vector1, vector2;
            describe('Vector', function () {
                beforeEach(function() {
                    vector1 = new Vector([1, 2, 3]);
                    vector2 = new Vector([4, 5, 6]);
                });
                it('check length', function () {
                    expect(vector1.getLength()).toEqual(3);
                });

                it('check toArray', function () {
                    expect(vector1.toArray()).toEqual([1, 2, 3]);
                });

                it('check isEqualDimension', function () {
                    expect(vector1.isEqualDimension(vector2)).toBeTruthy();
                });
            });

            describe('Utils', function () {
                it('check pow', function () {
                    expect(Utils.pow(5, 4)).toEqual(625);
                });

                it('check sqrt', function () {
                    expect(Utils.sqrt(625)).toEqual(25);
                });

                it('check round', function () {
                    expect(Utils.round(3422.365877, 3)).toEqual(3422.366);
                });

                describe('check pickRandom', function () {
                    var list = [2345, 34, -5, 23, 971, -345, 1000, 342, 223, 11111];

                    it('check no parameters', function () {
                        var item = Utils.pickRandom(list);
                        expect(list.indexOf(item)).toBeGreaterThan(-1);
                        expect(list.indexOf(item)).toBeLessThan(10);
                    });

                    it('check parameters length', function () {
                        var sub = Utils.pickRandom(list, 4);
                        expect(sub.length).toEqual(4);
                    });

                    it('check parameters content', function () {
                        var i, sub = Utils.pickRandom(list, 4);
                        for(i = 0; i < 4; i += 1) {
                            expect(list.indexOf(sub[i])).toBeGreaterThan(-1);
                            expect(list.indexOf(sub[i])).toBeLessThan(10);
                        }
                    });
                });

                describe('check min', function () {
                    var list = [2345, 34, -5, 23, 971, -345, 1000, 342, 223, 11111];

                    it('check no parameters', function () {
                        expect(Utils.min(list)).toEqual(-345);
                    });

                    it('check parameters', function () {
                        var accessor = function (node1, node2) {
                            return Math.abs(node1 - node2);
                        };
                        expect(Utils.min(list, 971, accessor)).toEqual(971);
                    });
                });

                describe('check isEqual', function () {
                    var obj1 = {
                        a: 5,
                        b: 92
                    }, obj2 = {
                        a: 5,
                        b: 92
                    }, list1 = [ obj1, obj2], list2 = [ obj1, obj2];

                    it('check with objects parameters', function () {
                        expect(Utils.isEqual(obj1, obj2)).toBeTruthy();
                    });

                    it('check with array parameters', function () {
                        expect(Utils.isEqual(list1, list2)).toBeTruthy();
                    });
                });

                describe('check isArray for objects', function () {
                    it('check with objects parameters', function () {
                        expect(Utils.isArray({})).toBeFalsy();
                    });

                    it('check isArray for arrays', function () {
                        expect(Utils.isArray([])).toBeTruthy();
                    });
                });
            });
        });
    });
})();
