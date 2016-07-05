
'use strict'

var XIterable = require('x-iterable-base/template')
var pair = require('./pair.js')

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

    ownnames: object =>
        () => getOwnPropertyNames(object)[iterator](),

    ownsymbols: object =>
        () => getOwnPropertySymbols(object)[iterator](),

    ownkeys: object => function * () {
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

var Root = XIterable(class {

    constructor(object, type = 'ownkeys') {
        var iterate = objectKeyIteratorCreators[type];
        return {
            object, type,
            getKeys: iterate(object),
            __proto__: this
        }
    }

    get configures() {
        return new ConfiguredPropertyIterable(this.object)
    }

    get data() {
        return new DataPropertyIterable(this.object)
    }

    get accessors() {
        return new AccessorPropertyIterable(this.object)
    }

    getObject() {
        return this.object
    }

})

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

module.exports = {
    Root,
    ConfiguredPropertyIterable,
    DataPropertyIterable,
    AccessorPropertyIterable,
    iterate: (...args) => new Root(...args),
    __proto__: pair
}
