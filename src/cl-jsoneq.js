let jsonEq = (json1, json2) => {
    if (sameType(json1, json2) === 'array') {
        if (json1.length !== json2.length)
            return false;
        for (let i = 0; i < json1.length; i++) {
            if (!jsonEq(json1[i], json2[i]))
                return false
        }
        return true;
    } else if (sameType(json1, json2) === 'map') {
        let keys1 = getKeys(json1);
        let keys2 = getKeys(json2);
        if (keys1.length !== keys2.length)
            return false;
        for (let i = 0; i < keys1.length; i++) {
            let key = keys1[i];
            if (json2[key] === undefined)
                return false;
            if (!jsonEq(json1[key], json2[key]))
                return false;
        }
        return true;
    } else if (sameType(json1, json2) === 'atom') {
        return json1 === json2;
    }
    return false;
}

let getKeys = (map) => {
    if (Object.keys) return Object.keys(map);
    let keys = [];
    for (let name in map) {
        keys.push(name);
    }
    return keys;
}

let sameType = (v1, v2) => {
    let type1 = getType(v1);
    let type2 = getType(v2);
    if (type1 === type2)
        return type1
    return false;
}

let getType = (v) => {
    if (isArray(v)) return 'array';
    else if (isMap(v)) return 'map';
    else if (isAtom(v)) return 'atom';
    throw new TypeError('Expect Array or Map or Atom type. Instead got ' + v);
}

let isArray = v => v && typeof v === 'object' && typeof v.length === 'number';

let isMap = v => v && typeof v === 'object' && typeof v.length !== 'number';

let isAtom = v => v === null ||
    typeof v === 'string' ||
    typeof v === 'number' ||
    typeof v === 'boolean'

module.exports = jsonEq;