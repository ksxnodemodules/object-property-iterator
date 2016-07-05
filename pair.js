
'use strict'

class Pair extends Array {
    get key() {
        return this[0]
    }
}

class ConfiguredPropertyIterator extends Pair {
    get descriptor() {
        return this[1]
    }
}

class AssignedPropertyIterator extends Pair {
    get value() {
        return this[1]
    }
}

class AccessorPropertyIterator extends Pair {
    get get() {
        return this[1]
    }
    get set() {
        return this[2]
    }
}

module.exports = {
    Pair,
    ConfiguredPropertyIterator,
    AssignedPropertyIterator,
    AccessorPropertyIterator
}
