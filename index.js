
(module => {
    'use strict';

    var {
        getOwnPropertyNames,
        getPrototypeOf,
        create: createObject
    } = Object

    class ObjectMap {

        constructor(object) {
            return {
                object,
                properties: getOwnPropertyNames(object),
                __proto__: this
            }
        }

        map(fn) {
            var result = createObject(getPrototypeOf(this.object));
            for (let property of this.properties) {
                let {name, value} = fn({name: property, value: object[property]}, this);
                result[name] = value;
            }
            return new this.constructor(result);
        }

        mapPropertyNames(fn) {
            return this.map(
                ({name, value}) => ({name: fn(name, this), value})
            );
        }

        mapPropertyValues(fn) {
            return this.map(
                ({name, value}) => ({name, value: fn(value, this)})
            );
        }

        swap() {
            return this.map(
                ({name, value}) => ({name: value, value: name})
            );
        }

        getObject() {
            return this.object;
        }

    }

    module.exports = class extends ObjectMap {};

})(module);
