
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
            for (let property of properties) {
                let {name, value} = fn({name: property, value: object[property]}, this);
                result[name] = value;
            }
            return new this.constructor(result);
        }

        mapPropertyName(fn) {
            return this.map(
                ({name, value}) => ({name: fn(name), value})
            );
        }

        mapPropertyValue(fn) {
            return this.map(
                ({name, value}) => ({name, value: fn(value)})
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
