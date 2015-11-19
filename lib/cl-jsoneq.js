'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var jsonEq = function jsonEq(json1, json2) {
    if (sameType(json1, json2) === 'array') {
        if (json1.length !== json2.length) return false;
        for (var i = 0; i < json1.length; i++) {
            if (!jsonEq(json1[i], json2[i])) return false;
        }
        return true;
    } else if (sameType(json1, json2) === 'map') {
        var keys1 = getKeys(json1);
        var keys2 = getKeys(json2);
        if (keys1.length !== keys2.length) return false;
        for (var i = 0; i < keys1.length; i++) {
            var key = keys1[i];
            if (json2[key] === undefined) return false;
            if (!jsonEq(json1[key], json2[key])) return false;
        }
        return true;
    } else if (sameType(json1, json2) === 'atom') {
        return json1 === json2;
    }
    return false;
};

var getKeys = function getKeys(map) {
    if (Object.keys) return Object.keys(map);
    var keys = [];
    for (var name in map) {
        keys.push(name);
    }
    return keys;
};

var sameType = function sameType(v1, v2) {
    var type1 = getType(v1);
    var type2 = getType(v2);
    if (type1 === type2) return type1;
    return false;
};

var getType = function getType(v) {
    if (isArray(v)) return 'array';else if (isMap(v)) return 'map';else if (isAtom(v)) return 'atom';
    throw new TypeError('Expect Array or Map or Atom type. Instead got ' + v);
};

var isArray = function isArray(v) {
    return v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && typeof v.length === 'number';
};

var isMap = function isMap(v) {
    return v && (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object' && typeof v.length !== 'number';
};

var isAtom = function isAtom(v) {
    return v === null || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
};

module.exports = jsonEq;