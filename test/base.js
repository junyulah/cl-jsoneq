import assert from 'assert';
import jsonEq from '../index';

describe('base', () => {
    it('base', () => {
        assert.equal(jsonEq(1, 1), true);
        assert.equal(jsonEq(1, 2), false);

        assert.equal(jsonEq('abc', 'abc'), true);
        assert.equal(jsonEq('abdc', 'abc'), false);

        assert.equal(jsonEq(null, null), true);

        assert.equal(jsonEq(true, true), true);
        assert.equal(jsonEq(false, false), true);
        assert.equal(jsonEq(true, false), false);

        assert.equal(jsonEq(1, '1'), false);
        assert.equal(jsonEq(0, false), false);
        assert.equal(jsonEq(null, 0), false);
    });

    it('arr', () => {
        assert.equal(jsonEq([], []), true);
        assert.equal(jsonEq([1, 2, 3], [1, 2, 3]), true);
        assert.equal(jsonEq([1, 2, 3], [3, 2, 1]), false);
        assert.equal(jsonEq([1, 2, 3], [1, 2]), false);
    });

    it('map', () => {
        assert.equal(jsonEq({}, {}), true);
        assert.equal(jsonEq({
            a: 1,
            b: 2
        }, {
            a: 1,
            b: 2
        }), true);

        assert.equal(jsonEq({
            a: 1,
            b: 2
        }, {
            a: 1,
            b: 3
        }), false);

        assert.equal(jsonEq({
            a: 1,
            b: 2,
            c: 3
        }, {
            a: 1,
            b: 2
        }), false);

        assert.equal(jsonEq({
            a: 1,
            b: 2
        }, {
            a: 1
        }), false);

        assert.equal(jsonEq({
            a: 1,
            b: 2
        }, {
            c: 1,
            d: 2
        }), false);
    });

    it('com', () => {
        assert.equal(jsonEq({
            a: [1, 2],
            b: {
                c: null,
                d: false,
                e: {
                    f: 'ok'
                }
            }
        }, {
            a: [1, 2],
            b: {
                c: null,
                d: false,
                e: {
                    f: 'ok'
                }
            }
        }), true);

        assert.equal(jsonEq({
            a: [1, 2],
            b: {
                c: null,
                d: false,
                e: {
                    f: 'ok'
                }
            }
        }, {
            a: [1, 2],
            b: {
                c: null,
                d: false,
                e: {
                    f: 'ok',
                    g: 'fine'
                }
            }
        }), false);
    });

    it('exception', (done) => {
        try {
            assert.equal(jsonEq(null, undefined), true);
        } catch (err) {
            assert.equal(err.toString().indexOf('TypeError') !== -1, true);
            done();
        }
    });

    it('exception2', (done) => {
        try {
            assert.equal(jsonEq(null, function() {}), true);
        } catch (err) {
            assert.equal(err.toString().indexOf('TypeError') !== -1, true);
            done();
        }
    });

    it('arr without order', () => {
        assert.equal(jsonEq([1, 2, 3], [3, 2, 1], {
            order: false
        }), true);
        assert.equal(jsonEq([1, 2, 3], [1, 2], {
            order: false
        }), false);

        assert.equal(jsonEq([
            [1, 2, 3],
            [4, 5],
            [6, 7]
        ], [
            [7, 6],
            [5, 4],
            [2, 3, 1]
        ], {
            order: false
        }), true);

        assert.equal(jsonEq(
            [1, 1, 2, 3], [1, 1, 2, 3], {
                order: false
            }), true);

        assert.equal(jsonEq(
            [1, 1, 2, 3], [1, 2, 3], {
                order: false
            }), false);
        assert.equal(jsonEq(
            [1, 2, 3], [1, 1, 2, 3], {
                order: false
            }), false);
    });
});