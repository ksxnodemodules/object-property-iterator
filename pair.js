
'use strict'

class Pair extends Array {
    get key() {
        return this[0]
    }
}

class Iterator extends Pair {}

class ConfiguredPropertyIterator extends Iterator {
    get descriptor() {
        return this[1]
    }
}

class AssignedPropertyIterator extends Iterator {
    get value() {
        return this[1]
    }
}

class DataPropertyIterator extends Iterator {
    get value() {
        return this[1]
    }
}

class AccessorPropertyIterator extends Iterator {
    get get() {
        return this[1]
    }
    get set() {
        return this[2]
    }
}

class ErrorPair extends Pair {
    get key() {
        return this[0]
    }
    get error() {
        return this[1]
    }
    raise() {
        throw this.error
    }
}

class AssignedPropertyReadingError extends ErrorPair {}

class AssignedPropertyWritingError extends ErrorPair {}

module.exports = {
    Pair,
    Iterator,
    ConfiguredPropertyIterator,
    AssignedPropertyIterator,
    AccessorPropertyIterator,
    ErrorPair,
    AssignedPropertyReadingError,
    AssignedPropertyWritingError
}
