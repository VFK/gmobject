# GMObject
> Create javascript objects using properties of another object.

Let's say you're gathering data as js objects from different sources. Chances are those objects are different from each other and you need to normalize them all.
This module can help you do this by creating "mapping rules" for each such object describing what property to take and how to modify it.

### Table of Contents

- [Usage](#usage)
- [What you can do](#what-you-can-do)
 - [Add properties](#add-properties)
 - [Rename properties](#rename-properties)
 - [Copy properties](#copy-properties-as-is)
 - [Make new properties from any number of old properties](#make-new-properties-from-any-number-of-old-properties)
- [Available methods](#available-methods)
- [Step by step](#step-by-step)
- [Notes](#notes)


## Usage
Install:
```shell
npm install --save gmobject
```

Require:
```javascript
var GMObject = require('gmobject');

var gmo = new GMObject();
```

Have your object ready:
```javascript
var myObject = {
    first: 'Hello',
    second: 'world',
    meaninglessNumber: 42
}
```

Make some mapping rules:
```javascript
gmo.add('computedProperty')
    .use('first', 'second')
    .handler(function(first, second) {
        return first + ', ' + second + '!';
    });
  
gmo.add('meaningOfLife').use('meaninglessNumber');

var result = gmo.parse(myObject);
// result = {computedProperty: 'Hello, world!', meaningOfLife: 42}
```

## What you can do
##### Add properties
```javascript
var myObject = {hello: 'world'};

gmo.add('newProperty')
    .handler(function() {
        return 'new value';
    });

var result = gmo.parse(myObject)
// result = {newProperty: 'new value'}
```

##### Rename properties
```javascript
var myObject = {hello: 'world'};

gmo.add('goodbye').use('hello');

var result = gmo.parse(myObject)
// result = {goodbye: 'world'}
```

##### Copy properties as is
```javascript
var myObject = {hello: 'world'};

gmo.use('hello');

var result = gmo.parse(myObject)
// result = {hello: 'world'}
```

##### Make new properties from any number of old properties
```javascript
var myObject = {first: 'Hello', second: 'world'};

gmo.add('computedProperty')
    .use('first', 'second')
    .handler(function(first, second) {
        return first + ', ' + second + '!';
    });

var result = gmo.parse(myObject)
// result = {computedProperty: 'Hello, world!'}
```

## Available methods
#### .add({String} property)
Create new `property` in result object

#### .use(...args)
Get property values from source object. If there is `handler` call after `use` it'll receive these values as arguments.

#### .handler(function)
Returned value form this function will be used as property value in result object.
If there is `use` before this method then it'll receive whatever it is in `use` as arguments:
```javascript
gmo.add('megaArg').use('arg1', 'arg2', 'arg3').handler(function(arg1, arg2, arg3) {
    // Do something with arg1, arg2 and arg3
    // Whatever will be returned from here will be used as value of `megaArg` property
})
```

#### gmo.parse(object) => {Object}
Call this at the end. Executes all mapping rules and returns new object. Don't chain it with other rules.

## Step by step
```javascript
// var oldObject = {old: 122}
// new object = {}
gmo
    .add('key') // At this point new object is {key: undefined}
    .use('old') // Take "old" property value from old object.
    .handler(function(old) { // "old" passed here, old === 122
        return old + 1; // At this point new object is {key: 123}
    })
// You can continue to add new properties
gmo.add('anotherKey').use('old').handler(function(old){
    return old + 345 // At this point new object is {key: 123, anotherKey: 468}
})

var newObject = gmo.parse(oldObject); // Call "parse" to return new mapped object
// newObject === {key: 123, anotherKey: 468}
```
## Notes
1. You can be explicit and always go full chain `add` => `use` => `handler` or you can use some magic.
For example to rename a property you can do this:
```javascript
gmo.add('renamed').use('oldProp').handler(function(oldProp) {
    return oldProp;
})
```
or you can skip a step:
```javascript
gmo.add('renamed').use('oldProp');
```
Look at [tests](https://github.com/VFK/gmobject/blob/master/test/test.js) to get the idea.

2. Properties are not automatically copied to the new object. To create a property you need to explicitly `add` it or you can just grab everything you need from the old object using magic:
```javascript
gmo.use('oldValue', 'anotherValue', 'someOtherValue')
```
Again, look at [tests](https://github.com/VFK/gmobject/blob/master/test/test.js) to get the idea.