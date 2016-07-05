
'use strict'

/* IMPORT */

var XIterable = require('x-iterable-base/template')
var pair = require('./pair.js')

/* LOCAL VARIABLES AND FUNCTIONS */

var {
    Pair,
    ConfiguredPropertyIterator,
    DataPropertyIterator,
    AccessorPropertyIterator
} = pair

var {
    getOwnPropertyNames,
    getOwnPropertySymbols,
    getOwnPropertyDescriptor,
    defineProperty,
    getPrototypeOf,
    create: createObject
} = Object

var {
    iterator
} = Symbol

var objectKeyIteratorCreators = {

    strings: object =>
        () => getOwnPropertyNames(object)[iterator](),

    symbols: object =>
        () => getOwnPropertySymbols(object)[iterator](),

    keys: object => function * () {
        yield * getOwnPropertyNames(object)
        yield * getOwnPropertySymbols(object)
    },

    __proto__: null

}

var mksibling = object =>
    createObject(getPrototypeOf(object))

var mksubobj = (iterable, Pair, names) => {
    var result = createObject(iterable)
    for (let index in names) {
        defineProperty(
            result, names[index], {
                get() {
                    let subobj = createObject(this)
                    for (let method of ['map', 'filter']) {
                        subobj[method] = fn => this[method](
                            elements => new Pair(
                                ...elements.slice(0, index),
                                fn(elements[index]),
                                ...elements.slice(index + 1)
                            )
                        )
                    }
                    return subobj
                },
                enumerable: true
            }
        )
    }
    return result
}

/* ROOT ABSTRACT CLASS */

var Root = XIterable(class {

    // first constructor

    constructor(object, type = 'keys') {
        var iterate = objectKeyIteratorCreators[type];
        return {
            object, type,
            getKeys: iterate(object),
            __proto__: this
        }
    }

    // first fundamental manipulation

    get configures() {
        return new ConfiguredPropertyIterable(this.object)
    }

    get data() {
        return new DataPropertyIterable(this.object)
    }

    get accessors() {
        return new AccessorPropertyIterable(this.object)
    }

    // alias

    getObject() {
        return this.object
    }

    mapProperties(fn) {
        return this.configures.map(fn)
    }

    mapPropertyKeys(fn) {
        return this.configures.keys.map(fn)
    }

    mapPropertyDescriptors(fn) {
        return this.configures.descriptors.map(fn)
    }

    mapDataProperties(fn) {
        return this.data.map(fn)
    }

    mapDataPropertyKeys(fn) {
        return this.data.keys.map(fn)
    }

    mapDataPropertyValues(fn) {
        return this.data.values.map(fn)
    }

    mapAccessorProperties(fn) {
        return this.accessors.map(fn)
    }

    mapAccessorPropertyKeys(fn) {
        return this.accessors.keys.map(fn)
    }

    mapAccessorPropertyGetters(fn) {
        return this.accessors.getters.map(fn)
    }

    mapAccessorPropertySetters(fn) {
        return this.accessors.setters.map(fn)
    }

    filterProperties(fn) {
        return this.configures.filter(fn)
    }

    filterPropertyKeys(fn) {
        return this.configures.keys.filter(fn)
    }

    filterPropertyDescriptors(fn) {
        return this.configures.descriptors.filter(fn)
    }

    filterDataProperties(fn) {
        return this.data.filter(fn)
    }

    filterDataPropertyKeys(fn) {
        return this.data.keys.filter(fn)
    }

    filterDataPropertyValues(fn) {
        return this.data.values.filter(fn)
    }

    filterAccessorProperties(fn) {
        return this.accessors.filter(fn)
    }

    filterAccessorPropertyKeys(fn) {
        return this.accessors.keys.filter(fn)
    }

    filterAccessorPropertyGetters(fn) {
        return this.accessors.getters.filter(fn)
    }

    filterAccessorPropertySetters(fn) {
        return this.accessors.setters.filter(fn)
    }

})

/* USABLE CLASSES */

class ConfiguredPropertyIterable extends Root {

    constructor(object, type) {

        var {getKeys} = super(object, type)

        return {

            * [iterator]() {
                for (let key of getKeys()) {
                    yield new ConfiguredPropertyIterator(key, getOwnPropertyDescriptor(object, key))
                }
            },

            get object() {
                var result = mksibling(object)
                for (let [key, descriptor] of this) {
                    descriptor && defineProperty(result, key, descriptor)
                }
                return result
            },

            __proto__: mksubobj(this, ConfiguredPropertyIterator, ['keys', 'descriptors'])

        }

    }

}

class DataPropertyIterable extends Root {

    constructor(object, type) {

        var {getKeys} = super(object, type)

        return {

            * [iterator]() {
                for (let key of getKeys()) {
                    yield new DataPropertyIterator(key, object[key])
                }
            },

            get object() {
                var result = mksibling(object)
                for (let [key, value] of this) {
                    result[key] = value
                }
                return result
            },

            __proto__: mksubobj(this, DataPropertyIterator, ['keys', 'values'])

        }

    }

}

class AccessorPropertyIterable extends Root {

    constructor(object, type) {

        var {getKeys} = super(object, type)

        return {

            * [iterator]() {
                for (let [key, {get, set, value}] of new ConfiguredPropertyIterable(object)) {
                    yield new AccessorPropertyIterator(key, get || (() => value), set || (x => value = x))
                }
            },

            get object() {
                var result = mksibling(object)
                for (let [key, get, set] of this) {
                    defineProperty(result, key, {get, set, enumerable: true})
                }
                return result
            },

            __proto__: mksubobj(this, AccessorPropertyIterator, ['keys', 'getters', 'setters'])

        }

    }

}

/* EXPORT */

module.exports = {
    Root,
    ConfiguredPropertyIterable,
    DataPropertyIterable,
    AccessorPropertyIterable,
    iterate: (...args) => new Root(...args),
    __proto__: pair
}
