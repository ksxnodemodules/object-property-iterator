
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

        mapDataProperties(fn) {
            var {object, properties} = this;
            var result = createObject(getPrototypeOf(object));
            for (let property of properties) {
                let {name, value} = fn({name: property, value: object[property]}, this);
                result[name] = value;
            }
            return new this.constructor(result);
        }

        mapDataPropertyNames(fn) {
            return this.mapDataProperties(
                ({name, value}) => ({name: fn(name, this), value})
            );
        }

        mapDataPropertyValues(fn) {
            return this.mapDataProperties(
                ({name, value}) => ({name, value: fn(value, this)})
            );
        }

        swapDataPropertyValues() {
            return this.mapDataProperties(
                ({name, value}) => ({name: value, value: name})
            );
        }

        getObject() {
            return this.object;
        }

    }

    module.exports = class extends ObjectMap {};

})(module);
