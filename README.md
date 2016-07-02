
# object-map
Transform an Object to another

## Requirements

 * ECMAScript 6 supports

## Examples

### Preparation

```javascript
var ObjectMap = require('object-map')
var object = {
    a: 0, b: 1, c: 2
}
```

### Transform both property names and values at once

```javascript
new ObjectMap(object).map(
    ({name, value}) => ({
        'name': name.toUpperCase(),
        'value': value * value
    })
).getObject()
```

### Transform property names and values independently

```javascript
new ObjectMap(object)
    .mapPropertyName(name => name.toUpperCase())
    .mapPropertyValue(value => value * value)
    .getObject()
```

### Swap property names and values

```javascript
new ObjectMap(object).swap().getObject()
```
