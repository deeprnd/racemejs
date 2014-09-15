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

                    it('check parameters content k<n/2', function () {
                        var i, sub = Utils.pickRandom(list, 4);
                        expect(sub.length).toEqual(4);
                        for(i = 0; i < sub.length; i += 1) {
                            expect(list.indexOf(sub[i])).toBeGreaterThan(-1);
                            expect(list.indexOf(sub[i])).toBeLessThan(10);
                        }
                    });

                    it('check parameters content k>n/2', function () {
                        var i, sub = Utils.pickRandom(list, 7);
                        expect(sub.length).toEqual(7);
                        for(i = 0; i < sub.length; i += 1) {
                            expect(list.indexOf(sub[i])).toBeGreaterThan(-1);
                            expect(list.indexOf(sub[i])).toBeLessThan(10);
                        }
                    });

                    it('check parameters equal length', function () {
                        var sub = Utils.pickRandom(list, 10);
                        expect(sub).toEqual(list);
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

                describe('check isArray', function () {
                    it('check with objects parameters', function () {
                        expect(Utils.isArray({})).toBeFalsy();
                    });

                    it('check with arrays', function () {
                        expect(Utils.isArray([])).toBeTruthy();
                    });
                });

                describe('check range', function () {
                    it('check with end', function () {
                        expect(Utils.range(5)).toEqual([0, 1, 2, 3, 4]);
                    });

                    it('check with start end', function () {
                        expect(Utils.range(-2, 3)).toEqual([-2, -1, 0, 1, 2]);
                    });

                    it('check with custom step', function () {
                        expect(Utils.range(-2, 3, 2)).toEqual([-2, 0, 2]);
                    });
                });

                describe('check size', function () {
                    it('check with object', function () {
                        expect(Utils.size({
                            x: 1,
                            y: 2
                        })).toEqual(2);
                    });

                    it('check with array', function () {
                        expect(Utils.size([1,2])).toEqual(2);
                    });
                });
            });
        });
    });
})();
