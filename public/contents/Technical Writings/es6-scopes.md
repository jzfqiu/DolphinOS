# ES6 Scopes

## 0. Compiler, Scope and Engine

[https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/scope%20%26%20closures/ch1.md](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/scope%20%26%20closures/ch1.md)

## 1. Variable Scope

### 1.1. Hoisting and Closure: var

The `var` declaration is function-scoped. 

> The scope of a variable declared with `var` is its current _execution context and closures thereof_, which is either the enclosing function and functions declared within it, or, for variables declared outside any function, global.

```javascript
'use strict';
function foo() {
    function bar() {
        var y = 2;
        console.log(x); // 1 (function `bar` closes over `x`)
        console.log(y); // 2 (`y` is in scope)
    }
    bar();
    console.log(x); // 1 (`x` is in scope)
    console.log(y); // ReferenceError in strict mode, `y` is scoped to `bar`
    var x = 1;  
}

foo();
```

Any variables declared with `var` are "hoisted" to the top before any execution takes place. The variable's value is `undefined` before assignment.

```javascript
'use strict';
function foo() {
    function bar() {
        console.log(x); // undefined
        console.log(y); // undefined
        var y = 2;
    }
    bar();
    console.log(x); // undefined
    console.log(y); // ReferenceError
    var x = 1;  
}

foo();
```

### 1.2. const and let

`const` and `let` are block-scoped, meaning they are accessible in the same block of their definition. 

```javascript
const globalA = "a";
function foo() {
    const fooA = "a";
    console.log(globalA);
    (function () { console.log(fooA) })();
}

console.log(fooA); // ReferenceError
foo(); // undefined
```

Attempting to change a `const` defined variable will result in `TypeError`

## 2. Function Scope

TODO