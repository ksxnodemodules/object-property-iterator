
# object-property-iterator
Traverse object properties, create mirror objects

## Requirements

 * ECMAScript 6 supports

## Features

 * Traverse own properties of an object

 * Create mirror object by mapping/filtering properties

## Usage

### Import module

```javascript
var {
    Root: ObjectIterable,
    ConfiguredPropertyIterable,
    AssignedPropertyIterable,
    AccessorPropertyIterable,
    iterate
} = require('object-property-iterator')
```

### Create an `ObjectIterable`

**Example:** `AssignedPropertyIterable`

> You can replace `.assignments` by `.configures`, `.data`, or `.accessors` to create other kinds of `ObjectIterable`

> You can replace `'strings'` by `'symbols'` or `'keys'` to traverse different types of property keys. Default is `'keys'` if not provided

```javascript
var iterable = iterate(object, 'strings').assignments
```

```javascript
var iterable = new ObjectIterable(object, 'strings').assignments
```

```javascript
var iterable = new AssignedPropertyIterable(object, 'strings')
```

### Get an object from an `ObjectIterable`

```javascript
var result = iterable.object
```

```javascript
var result = iterable.getObject()
```

### Examples

Create an object from another object throught a map function

#### Input

> Define `myprt` yourself

```javascript
var object = {
    a: 0, b: 1, c: 2,
    d: 3, e: 4, f: 5,
    __proto__: myprt
}
```

#### Output

> The result should be equivalent to this action

```javascript
var result = {
    A: 0, B: 1, C: 4,
    D: 9, E: 16, F: 25,
    __proto__: myprt
}
```

#### Codes

There're many ways to do the job

```javascript
var result = iterate(object).assignments
    .map(([key, value]) => [key.toUpperCase(), value * value])
    .object
```

```javascript
var result = iterate(object).assignments
    .keys.map(x => x.toUpperCase())
    .values.map(x => x * x)
    .object
```

```javascript
var result = iterate(object)
    .mapAssignedProperties(([key, value]) => [key.toUpperCase(), value * value])
    .getObject()
```

```javascript
var result = iterate(object)
    .mapAssignedPropertyKeys(x => x.toUpperCase())
    .mapAssignedPropertyValues(x => x * x)
    .getObject()
```

> You can replace `map` by `filter` to create an object throught a filter function

## License

MIT
