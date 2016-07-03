
# object-map
Transform an Object to another

## Requirements

 * ECMAScript 6 supports

## Examples

### Preparation

```javascript
var ObjectMap = require('object-map')
var object = {
    a: 0, b: 1, c: 2, d: 3
}
```

### Transform both property names and values at once

```javascript
new ObjectMap(object).mapDataProperties(
    ({name, value}) => ({
        'name': name.toUpperCase(),
        'value': value * value
    })
).getObject()
```

### Transform property names and values independently

```javascript
new ObjectMap(object)
    .mapDataPropertyNames(name => name.toUpperCase())
    .mapDataPropertyValues(value => value * value)
    .getObject()
```

### Swap property names and values

```javascript
new ObjectMap(object).swapDataPropertyValues().getObject()
```
