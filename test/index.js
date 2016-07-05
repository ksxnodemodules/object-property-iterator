
'use strict'

/* PREPARATION */

var objiter = require('..')

var {
    iterate
} = objiter

var object = {
    a: 0, b: 1, c: 2,
    d: 3, e: 4, f: 5,
    __proto__: null
}

/* ALL TESTS */

var result = {

    // MAP

    // both at once
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

    // step by step
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

    // FILTER

    // both at once
    '.configures.filter':
        iterate(object).configures.filter(
            ([key, {value}]) => key > 'c' && value & 1
        ).object,
    '.assignments.filter':
        iterate(object).assignments.filter(
            ([key, value]) => key > 'c' && value & 1
        ).object,
    '.data.filter':
        iterate(object).data.filter(
            ([key, value]) => key > 'c' && value & 1
        ).object,
    '.accessors.filter':
        iterate(object).accessors.filter(
            ([key, get]) => key > 'c' && get() & 1
        ).object,

    // step by step
    '.configures.keys.descriptors.filter':
        iterate(object).configures
            .keys.filter(x => x > 'c')
            .descriptors.filter(({value}) => value & 1)
            .object,
    '.assignments.keys.values.filter':
        iterate(object).assignments
            .keys.filter(x => x > 'c')
            .values.filter(x => x & 1)
            .object,
    '.data.keys.values.filter':
        iterate(object).data
            .keys.filter(x => x > 'c')
            .values.filter(x => x & 1)
            .object,
    '.accessors.keys.getters.setters.filter':
        iterate(object).accessors
            .keys.filter(x => x > 'c')
            .getters.filter(f => f() & 1)
            .setters.filter(() => true)
            .object,

    // FINALLY
    
    __proto__: null

}

/* OUTPUT */

module.exports = JSON.stringify(result, undefined, 2)
