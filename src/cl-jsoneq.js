let jsonEq = (json1, json2, opts) => {
    if (sameType(json1, json2) === 'array') {
        return eqArr(json1, json2, opts);
    } else if (sameType(json1, json2) === 'map') {
        let keys1 = getKeys(json1);
        let keys2 = getKeys(json2);
        if (keys1.length !== keys2.length)
            return false;
        for (let i = 0; i < keys1.length; i++) {
            let key = keys1[i];
            if (json2[key] === undefined)
                return false;
            if (!jsonEq(json1[key], json2[key], opts))
                return false;
        }
        return true;
    } else if (sameType(json1, json2) === 'atom') {
        return json1 === json2;
    }
    return false;
};

let eqArr = (json1, json2, opts) => {
    if (json1.length !== json2.length)
        return false;
    if (opts.order) {
        for (let i = 0; i < json1.length; i++) {
            if (!jsonEq(json1[i], json2[i], opts))
                return false;
        }
    } else {
        for (let i = 0; i < json1.length; i++) {
            if (!contain(json2, json1[i], opts))
                return false;
        }
        for (let i = 0; i < json2.length; i++) {
            if (!contain(json1, json2[i], opts))
                return false;
        }
    }
    return true;
};

let contain = (list, item, opts) => {
    for (let i = 0; i < list.length; i++) {
        if (jsonEq(list[i], item, opts))
            return true;
    }
    return false;
};

let getKeys = (map) => {
    if (Object.keys) return Object.keys(map);
    let keys = [];
    for (let name in map) {
        keys.push(name);
    }
    return keys;
};

let sameType = (v1, v2) => {
    let type1 = getType(v1);
    let type2 = getType(v2);
    if (type1 === type2)
        return type1;
    return false;
};

let getType = (v) => {
    if (isArray(v)) return 'array';
    else if (isMap(v)) return 'map';
    else if (isAtom(v)) return 'atom';
    throw new TypeError('Expect Array or Map or Atom type. Instead got ' + v);
};

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

let isMap = v => v && typeof v === 'object' && typeof v.length !== 'number';

let isAtom = v => !v ||
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean';

let merge = (def, opts) => {
    for (let name in opts) {
        def[name] = opts[name];
    }
    return def;
};

module.exports = (json1, json2, opts) => {
    opts = merge({
        order: true
    }, opts);
    return jsonEq(json1, json2, opts);
};
