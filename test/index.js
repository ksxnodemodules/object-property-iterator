
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
        ).object,
    '.assignments.map':
        iterate(object).assignments.map(
            ([key, value]) =>
                [key.toUpperCase(), value * value]
        ).object,
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
    '.configures.keys.descriptors.map':
        iterate(object).configures
            .keys.map(x => x.toUpperCase())
            .descriptors.map(({value}) => ({
                value: value * value,
                enumerable: true
            }))
            .object,
    '.assignments.keys.values.map':
        iterate(object).assignments
            .keys.map(x => x.toUpperCase())
            .values.map(x => x * x)
            .object,
    '.data.keys.values.map':
        iterate(object).data
            .keys.map(x => x.toUpperCase())
            .values.map(x => x * x)
            .object,
    '.accessors.keys.getters.setters.map':
        iterate(object).accessors
            .keys.map(x => x.toUpperCase())
            .getters.map(f => () => f() * f())
            .setters.map(f => x => f(Math.sqrt(x)))
            .object,
    __proto__: null
}

module.exports = JSON.stringify(result, undefined, 2)
