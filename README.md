# DolphinOS

Icon source: https://www.flaticon.com/packs/technology-icon-collection/

## To-do

1. React Router integration
2. Adjust project layout base on open source examples
3. Write tests

## Notes

### Function Binding and React Eventlistener

From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind):

    The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.

The `this` keyword sets the context in which the function executes. Binding context using `bind()` is useful in Child to Parent communication in React, since sometimes we want the child the invoke the function that has a parent context.  

For example, say we want to tell the parent that a child component has been clicked. We set up the child and parent like so:

```JSX
// Parent.tsx

import { Component } from "react";
import Child from "./Child";

export default class Parent extends Component<{}, { hi: string }> {
	constructor(props: {}) {
		super(props);
		this.state = {
			hi: "Hi from parent!",
		};
	}

	sayHi() {
		console.log(this.state.hi);
	}

	render() {
		return (
			<div>
				Parent
				<Child onClickCallback={this.sayHi.bind(this)} />
			</div>
		);
	}
}


// Child.tsx

import { Component } from "react";

export default class Child extends Component<
	{ onClickCallback: () => void },
	{}
> {
	render() {
		return <div onClick={this.props.onClickCallback}>Child</div>;
	}
}
```

Clicking on child will print `Hi from parent!` in console. The onClickCallback, when passed to the child through props, is bind to the parent's context. Therefore the function will print the parent's state instead of the child's.  

If we wish to pass information from child to parents, we can simply bind the callback with more arguments in child:

```JSX
// Parent.tsx

import { Component } from "react";
import Child from "./Child";

export default class Parent extends Component<{}, { hi: string }> {
	constructor(props: {}) {
		super(props);
		this.state = {
			hi: "Hi from parent!",
		};
	}

	sayHi(childId: string) {
		console.log(this.state.hi + ` And from child ${childId}`);
	}

	render() {
		return (
			<div>
				Parent
				<Child onClickCallback={this.sayHi.bind(this)} />
			</div>
		);
	}
}

// Child.tsx

import { Component } from "react";

type ChildProps = {
	onClickCallback: (childId: string) => void;
};

type ChildState = {
    childId: string,
    hi: string, 
}

export default class Child extends Component<ChildProps, ChildState> {
	constructor(props: ChildProps) {
		super(props);
		this.state = {
			childId: "1",
            hi: "Hi from Child!",
		};
	}

	render() {
		return (
			<div onClick={this.props.onClickCallback.bind(this, this.state.childId)}>
				Child
			</div>
		);
	}
}
```

Clicking on child will print `Hi from parent! And from child 1` in console.

Note that although binding occurs again when child pass the callback to the `onClick` eventlistener, the context binding is not replaced. From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this):

    Calling f.bind(someObject) creates a new function with the same body and scope as f, but where this occurs in the original function, in the new function it is permanently bound to the first argument of bind, regardless of how the function is being used.

The second binding is necessary because of the DOMs in the `render()` method are different from the component class, therefore have different context. (See [React's documentation](https://reactjs.org/docs/faq-functions.html#why-is-binding-necessary-at-all)) 

However, what if the context bound to the function changes before the bound function is called? 

```jsx
// Parent.tsx

    ...

	click(childId: string) {
    const c = this.state.clicked;
    this.setState({clicked: c+1});
    console.log(`Clicked on ${childId}. Children clicked ${this.state.clicked} times`);
	}

	render() {
		return (
			<div>
				Parent
                <Child onClickCallback={this.click.bind(this)} childId="1"/>
				<Child onClickCallback={this.click.bind(this)} childId="2"/>
			</div>
		);
	}
}

// Child.tsx

...

export default class Child extends Component<ChildProps, ChildState> {

	render() {
		return (
			<div onClick={this.props.onClickCallback.bind(this, this.props.childId)}>
				Child
			</div>
		);
	}
}
```
After some clicking, console outputs the following:

```
Clicked on 1. Children clicked 0 times
Clicked on 1. Children clicked 1 times
Clicked on 1. Children clicked 2 times
Clicked on 1. Children clicked 3 times
Clicked on 2. Children clicked 4 times
Clicked on 2. Children clicked 5 times
Clicked on 2. Children clicked 6 times
Clicked on 2. Children clicked 7 times
Clicked on 1. Children clicked 8 times
Clicked on 2. Children clicked 9 times
```

The binding behaves more like a pointer to the original context than an exact copy, which is convenient if we want the child to modify the parent's state. 

References:
- [MDN: `this` keyword](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)  
- [MDN: `bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [Yehuda Katz: Understanding JavaScript Function Invocation and "this"](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/)

