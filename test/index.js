
'use strict'

var objiter = require('..')

var {
    iterate
} = objiter

var object = {
    a: 0, b: 1, c: 2,
    d: 3, e: 4, f: 5,
    __proto__: null
}

var result = {
    '.configures.map':
        iterate(object).configures.map(
            ([key, {value}]) =>
                [key.toUpperCase(), {value: value * value, enumerable: true}]
        ).data.object,
    '.data.map':
        iterate(object).data.map(
            ([key, value]) =>
                [key.toUpperCase(), value * value]
        ).object,
    '.accessors.map':
        iterate(object).accessors.map(
            ([key, get, set]) =>
                [key.toUpperCase(), () => get() * get(), x => set(Math.sqrt(x))]
        ).object,
    __proto__: null
}

module.exports = JSON.stringify(result, undefined, 2)
