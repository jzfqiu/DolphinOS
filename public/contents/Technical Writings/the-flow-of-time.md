# ES6 Event Loop

## 1. The Event Loop

### 1.1. The Conceptual Model

![Conceptual Model](https://mdn.mozillademos.org/files/17124/The_Javascript_Runtime_Environment_Example.svg)

For the most part, running a JS script is like running any other applications. The runtime system \(V8 for Chrome or webkit for Safari\) takes care of memory management, I/O, procedure communication, and other low level supports.

Like most executables, JS uses stack frame for function calls and local variables declared inside function scope, although with some special twists including closure and hoisting. Heap is the unorganized memory region that persist during runtime. It is also where objects are allocated.

### 1.2. Message Processing

A special component in JS's execution model is the message queue, sometimes also known as "task queue" or "callback queue". A message is typically an event with with an associated function that processes the message. During the event loop, the runtime continuously dequeues a message, load the message into its associated function and push it onto the stack, execute the function until it returns, and dequeues another message.

Since JS is **single-threaded**, messages are **"Run-to-Completion"**, meaning once a message is dequeued, nothing can be processed until the message is processed. This is different from C or Python, where an interruption such as I/O event can pause or resume a process. JS handle these types of interruptions by adding them to the message queue.

For example, a cross-origin `iframe` element maintains a separate stack, heap and message queue from the host page. The element communicate with the page via `postMessage` method, which pushes a message into another runtime's message queue.

### 1.3. Word Choice: Synchronicity and Blocking

JS developers often talks about **Synchronous** and **Asynchronous** execution.

```text
When you execute something synchronously, you wait for it to finish before moving on to another task. When you execute something asynchronously, you can move on to another task before it finishes.
```

Given the nature of the event loop described above, nothing in JS is actually "asynchronous". An "asynchronous" event or function merely separate the execution into several parts, as we will see in later section.

When MDN talks about JS as "non-blocking", it means that events considered to be "blocking" in other languages \(such as network and file operations\) do not interrupt the flow of execution in the event loop. There is no native method that stops the flow except for a few legacy methods such as `alert`. Others, however, may describe JS as "blocking" because processing of one message blocks other messages from being processed.

In a word, these terminologies have no strict definition and should be interpreted in context.

### 1.4. Example: `setTimeout()`

The `setTimeout(function, delay)` pushes `function` into the message queue after `delay` milliseconds. Since messages in the queue are processed one by one, the function is not guaranteed to execute after `delay` ms.

`setTimeout()` is provided by the browser

```javascript
(function() {
    console.log(1); 
    setTimeout(function(){console.log(2)}, 1000); 
    setTimeout(function(){console.log(3)}, 0); 
    console.log(4);
})();

// 1    
// 4
// 3
// 2
```

* When function is called, function gets pushed onto the stack.
* In the first line of the function, `console.log(1)` is pushed onto the stack and executed.
* In the second line, `setTimeout(...console.log(2)...)` pushed onto the stack and executed. It sends the arguments to an web API on another thread, which starts the countdown. After 1s, the API enqueues `console.log(2)` into the queue.
* In the third line, `setTimeout(...console.log(3)...)` enqueues `console.log(2)` into the queue immediately. However, it is not executed since `function` has not return yet.
* Finally, `console.log(4)` is executed. The function returns and start processing the next message in the queue, which is `console.log(3)`

## 2. Out of the Loop

### 2.1. Task vs. Microtask

Outside the synchronous part of the event loop, a "microtask" queue handles the async operations. This **job queue** \(queues "microtask"\), together with message queue \(queues messages or "tasks"\) and stack, determines the order of execution of JS codes.

```text
A task is any JavaScript code which is scheduled to be run by the standard mechanisms such as initially starting to run a program, an event callback being run, or an interval or timeout being fired. These all get scheduled on the task queue.
```

At any given time, the event loop is either executing code on the stack or dequeueing from one of the queues. When the stack is empty, the job queue has priority over the message queue. If there are microtasks in the job queue, event loop executes them until the job queue is empty. This include dynamically added microtasks such as those scheduled by chained `Promise()`.

Note that stack still gets highest priority: nothing else can run before stack gets emptied.

### 2.2. Example of Task/Microtask Ordering

Credit to [Jack Archibald and his awesome diagrams](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/).

Suppose we have the following HTML and JS code:

```markup
<div class="outer">
  <div class="inner"></div>
</div>
```

```javascript
// Let's get hold of those elements
var outer = document.querySelector('.outer');
var inner = document.querySelector('.inner');

// Let's listen for attribute changes on the outer element
new MutationObserver(function() {
  console.log('mutate');
}).observe(outer, {
  attributes: true
});

// Here's a click listener…
function onClick() {
  console.log('click');

  setTimeout(function() {
    console.log('timeout');
  }, 0);

  Promise.resolve().then(function() {
    console.log('promise');
  });

  outer.setAttribute('data-random', Math.random());
}

// …which we'll attach to both elements
inner.addEventListener('click', onClick);
outer.addEventListener('click', onClick);

inner.click()
```

Note that:

1. `click()` simulates the mouse clicking action, which means that it "[bubbles up](https://javascript.info/bubbling-and-capturing)" from inner element to outer elements.
2. `observe()` observes a change in object asynchronously, which means that it queues a microtask instead of a task. It is also [obsolete](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe) and should not be used elsewhere.
3. For some odd reasons, the "mutation observer" will only queue one microtask per time. In this case, if a `MutationObserver()` microtask is already in queue, microtask for another mutation will be dropped. \([spec](https://dom.spec.whatwg.org/#mutation-observers)\)

Executing the script and we get:

```text
click
click
promise
mutate
promise
timeout
timeout
```

The `click` happened twice before any microtask or task run because `inner.click()` returns only after the bubble-up process is completed. It calls the `onClick()` function twice \(once on `inner` and once on `outer`\), prints two `click`s, throws 2 promises and 1 mutation observer into the job queue, put two `setTimeout()` callback into the message queue, then returns. Only then does the event loop check to see if there is anything in the queues.

## 3. References

* [MDN: Concurrency model and the event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)  
* [MDN: Microtasks and the JavaScript runtime environment](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth)
* [MDN: Using microtasks in JavaScript with `queueMicrotask()`](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide)
* [Stackoverflow: blocking in JS](https://stackoverflow.com/questions/13635297/emulate-javascript-alert-blocking-nature)
* [John Resig: How JS Timer Works](https://johnresig.com/blog/how-javascript-timers-work/)
* [Stackoverflow: Async vs Sync](https://stackoverflow.com/questions/748175/asynchronous-vs-synchronous-execution-what-does-it-really-mean)
* [SessionStack: Event Loop and the Rise of Async Programming](https://blog.sessionstack.com/how-javascript-works-event-loop-and-the-rise-of-async-programming-5-ways-to-better-coding-with-2f077c4438b5)
* [Jake Archibald: Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
* [javascript.info: Bubbling and Capturing](https://javascript.info/bubbling-and-capturing)

