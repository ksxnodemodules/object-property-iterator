
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

var mkownmap = (map, self) => ({map, __proto__: self})

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
                    defineProperty(result, key, descriptor)
                }
                return result
            },

            get keys() {
                return mkownmap(
                    fn => this.map(
                        ([key, descriptor]) =>
                            new ConfiguredPropertyIterator(fn(key), descriptor)
                    ),
                    this
                )
            },

            get descriptors() {
                return mkownmap(
                    fn => this.map(
                        ([key, descriptor]) =>
                            new ConfiguredPropertyIterator(key, fn(descriptor))
                    ),
                    this
                )
            },

            __proto__: this

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

            get keys() {
                return mkownmap(
                    fn => this.map(
                        ([key, value]) =>
                            new DataPropertyIterator(fn(key), value)
                    ),
                    this
                )
            },

            get values() {
                return mkownmap(
                    fn => this.map(
                        ([key, value]) =>
                            new DataPropertyIterator(key, fn(value))
                    ),
                    this
                )
            },

            __proto__: this

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

            get keys() {
                return mkownmap(
                    fn => this.map(
                        ([key, get, set]) =>
                            new AccessorPropertyIterator(fn(key), get, set)
                    ),
                    this
                )
            },

            get getters() {
                return mkownmap(
                    fn => this.map(
                        ([key, get, set]) =>
                            new AccessorPropertyIterator(key, fn(get), set)
                    ),
                    this
                )
            },

            get setters() {
                return mkownmap(
                    fn => this.map(
                        ([key, get, set]) =>
                            new AccessorPropertyIterator(key, get, fn(set))
                    ),
                    this
                )
            },

            __proto__: this

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
