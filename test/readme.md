
# Tester

## Run test

Run `npm test` under project's root directory (containing `package.json` file)

## Provided input

```javascript
var object = {
    a: 0, b: 1, c: 2,
    d: 3, e: 4, f: 5,
    __proto__: null
}
```

## Expected output

The `npm test` command should results a JSON representation of an object whose properties are objects that can be classified into two groups: [Map](#map) and [Filter](#filter)

### Map

 * Output's property names that refer to objects (called *Results* below) in this group contain `.map` at the end

 * Results' property names are all UPPERCASE

 * Results' property values are squared numbers of the provided input

```json
{
    "A": 0,
    "B": 1,
    "C": 4,
    "D": 9,
    "E": 25,
    "F": 36
}
```

### Filter

 * Output's property names that refer to objects (called *Result* below) in this group contain `.filter` at the end

 * Results' property names stand behind letter *c* in the alphabet

 * Results' property values are odd integers

```json
{
    "d": 3,
    "f": 5
}
```
