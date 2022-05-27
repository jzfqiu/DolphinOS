# \[D04\] ES6 This

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this): `this` is a property of an **execution context**. There are several types of contexts:

## 1. Global Context

Outside function, `this` is equivalent to the global `window` object:

```javascript
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = "MDN";
console.log(window.b)  // "MDN"
console.log(b)         // "MDN"
```

## 2. Function Context

In non-strict mode, function called under the global context returns `Window`

```javascript
function foo() { return this; }

foo() // Window
```

In strict mode, function called directly returns `undefined`. However, if called under the global object, the function returns the `Window` object:

```javascript
function strictFoo() { 
    'use strict';
    return this; 
}

strictFoo(); // undefined
window.strictFoo(); // Window
```

This is similar to `this` under object method.

### 2.1. As Object Method

TODO