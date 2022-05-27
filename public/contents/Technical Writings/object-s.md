# ES6 Object\(s\)

According to MDN, there 2 kinds of data types in JS:

* Primitive data types \(Boolean, Null, Undefined, Number, BigInt, String, Symbol\)
* Object

## 1. The Global Objects

[MDN](https://developer.mozilla.org/en-US/docs/Glossary/Global_object):

```text
In JavaScript, there's always a global object defined. In a web 
browser, when scripts create global variables, they're created 
as members of the global object. 

In a web browser, any code which the script doesn't specifically 
start up as a background task has a Window as its global object. 
```

This means that every variable defined in the script is a property of the `window` object:

```javascript
var foo = 10;
foo === window.foo // ture
```

Similarly, most "data types" defined in JS are actually internal properties and methods of the global object.

```javascript
Object === window.Object // true
```

These properties and methods are divided into several categories:

* **Value properties**: global properties that has no method or properties themselves, such as `undefined`, `Infinity`, and `NaN`
* **Function properties**: global methods that can be called everywhere, such as `isNaN()` and the infamous `eval()`
* **Fundamental objects**: the basic basic types, such as `Function`, `Object`, `Boolean`, and various error objects like `Error`
* **Numbers and dates**: `Number`, `Date`, and `Math`
* **Text processing**: `String` and `RegExp`
* **Indexed collections**: `Array`
* **Keyed collection**: `Map` and `Set`
* **Control abstraction objects**: Objects help to structure code \(mostly used in async operations\), such as `Promise`, `AsyncFunction`, and `Iterator`

## 2. Object \(the `Object` Object\)

[ECMA262 6.1.7 The Object Type](https://tc39.es/ecma262/#sec-object-type):

```text
An Object is logically a collection of properties. Each property 
is either a data property, or an accessor property.
```

There is the data type Object, and there is the instance of that data type `Object === window.Object`. For the most part, we are talking about the latter, although the conceptual components are the same between the two.

Objects have two kinds of properties: data properties or just "properties", and function properties or "methods".

### 2.1. Properties, Setter and Getter

A data property is a value. It can be an instance of any JS data types. It may be writable \(can change value\), enumerable \(can be used in a `for..in` loop\), and/or configurable \(can be deleted or change attributes other than its value\).

In JS, these properties can be explicitly set using `Object.defineProperty()` \(or implicitly defined\):

```javascript
'use strict'
let obj = {someProp: 10};
Object.defineProperty(obj, 'notWritableProp', {
    value: 5, 
    writable: false
});

obj.notWritableProp = 100; 
// TypeError: Cannot assign to read only property 'notWritableProp' of object
```

An accessor property is either a `getter` or `setter`, both are initally undefined by default.

```javascript
let obj = {
    set setB(value) {this.b = value},
    get getB() {return this.b}
}
obj.setB = 10;
obj.getB    // 10
obj.b       // 10
```

It is worth noting that while properties can have the same name, later defined properties will override the ones before them. However, getters and setters can have the same name:

```javascript
let o = {
    a: 'hello',
    a: 100,
    set b(val) {this.a=val}, 
    get b() {return this.a}
}

o.a         // 100 ('hello' is overridden)
o.b         // 100 (getter is defined)
o.b = 10    
o.a         // 10 (setter is also defined)
```

### 2.2. Internal Methods: Constructors and Callables

Internal methods are methods of the object that are defined by the ECMAScript engine. A list of essential internal methods can be found [here](https://tc39.es/ecma262/#table-5). Among them are two noteworthy methods: `[[Call]]` and `[[Construct]]`.

The `[[Call]]` method is invoked via a function call expression while the `[[Construct]]` method is invoked via the `new` or `super` keyword.

The`[[Call]]` method executes code associated with the object while the `[[Construct]]` method creates a new object.

Objects that implement `[[Call]]` are called callables. Objects that implement `[[Construct]]` are called constructors, although some "constructors" can also be called as functions.

For example, the `Number()` constructor:

```javascript
const a = new Number('123');    // called as constructor
const b = Number('123');        // called as function
const c = 123;
a instanceof Number;        // true 
b instanceof Number;        // false
typeof(a);       // object
typeof(b);       // number
typeof(c);       // number
```

If we have the instance of an object, the constructor function for that object is accessed through the `constructor` property. For objects, it is `Object.prototype.constructor`

```javascript
let o = {}
o.constructor // Object() { [native code] }
let a = []
a.constructor // Array() { [native code] }
let n = new Number() 
n.constructor // Number() { [native code] }
Number.prototype.constructor === Number // true
```

We can declare a callable object with the explicit use of a **constructor function**:

```javascript
function Callable(val){
    this.v = val;
    return this.v+1;
}

let c = new Callable(10);
let d = Callable(10);
c // Callable {v: 10}
d // 11

c.constructor == Callable // true
Callable.constructor === Object.constructor // true
```

In which case, the constructor function can be accessed via the `constructor` method:

This is one of the three ways to declare an object in JS. The other two ways are **object initializer** \(declare within bracket\) and `Object.create()` method.

### 2.3. Prototype

[ECMA262 4.3.5 Prototype](https://tc39.es/ecma262/#sec-terms-and-definitions-prototype):

```text
Prototype is an object that provides shared properties for other 
objects
```

An example:

```javascript
function Parent(val) {this.foo = val}

var child1 = new Parent(1);
child2.foo  // 1

var child2 = new Parent(2);
child2.__proto__.bar = 100

var child3 = new Parent(3);
child1.bar // 100
child2.bar // 100
child3.bar // 100
```

If we examine the objects in detail:

```javascript
// child1
Parent {foo: 10}
    foo: 1
    __proto__:
        bar: 100
        constructor: ƒ Parent(val)
        __proto__: Object
```

Adding a property to the prototype of the object creates a property for all instances of the object.

The prototype of an instance of an object is accessed through the `__proto__` property, while the prototype of an object is accessed through the `prototype` property:

```javascript
var obj = {};
obj.__proto__ // constructor: ƒ Object()...
Object.prototype // constructor: ƒ Object()
obj.__proto__ === Object.prototype // true
child1.__proto__ === Parent.prototype // true

Array.prototype // constructor: ƒ Array() ...
```

### 2.4. Inheritance and Prototype Chain

```javascript
var o = {a: 1};
// The newly created object o has Object.prototype as its [[Prototype]]
// o has no own property named 'hasOwnProperty'
// hasOwnProperty is an own property of Object.prototype. 
// So o inherits hasOwnProperty from Object.prototype
// Object.prototype has null as its prototype.
// o ---> Object.prototype ---> null

var b = ['yo', 'whadup', '?'];
// Arrays inherit from Array.prototype 
// (which has methods indexOf, forEach, etc.)
// The prototype chain looks like:
// b ---> Array.prototype ---> Object.prototype ---> null

function f() {
  return 2;
}
// Functions inherit from Function.prototype 
// (which has methods call, bind, etc.)
// f ---> Function.prototype ---> Object.prototype ---> null
```

## 3. Primitive Data Types

```text
A primitive value is a datum that is represented directly at the lowest level of the language implementation.
```

There is, however, distinctions between these primitive data types and their corresponding objects, as seen in `Number()` and `String()`

### 3.1. `null` and `undefined`

From ECMAScript spec:

* `null`: primitive value that represents **the intentional absence of any object value**
* `undefined`: primitive value used when **a variable has not been assigned a value**

In practice, `null` is one of the standard built-in object while `underfined` is a value property of the global object.

Both `null` and `undefined` are what JS calls "falsy" values. Note the type coercion occurred when used in comparison.

```javascript
typeof null          // "object" (not "null" for legacy reasons)
typeof undefined     // "undefined"
null === undefined   // false
null  == undefined   // true
null === null        // true
null == null         // true
!null                // true
isNaN(1 + null)      // false
isNaN(1 + undefined) // true
```

## Reference

* [ECMAScript Latest Draft \(ECMA-262\)](https://tc39.es/ecma262/)
* [MDN: Standard Built-in Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects)
* [MDN: Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

