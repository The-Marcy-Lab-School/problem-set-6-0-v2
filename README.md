# Assignment 6.0 - Foundation of Promises

# Question 1: resolvedWrapper
Promises have 3 states: pending, fulfilled, or rejected. Pending just means the promise hasn't settled yet, so let's instead work on "fulfilled" first. Remember, a fulfilled promise means that a value was returned without an error.

> ## fulfilled vs resolved
> Now, it's true that "fulfilled" means a promise completed without an error, and "resolved" *technically* means a promise is just completed, and could be either fine *or* have an error. However, **most** people simply say "resolved" meaning no error, and "rejected" meaning an error. So from here on out, that's how we'll refer to promises: **pending, resolved, or rejected.**

The `resolvedWrapper` function takes in any value and then returns a resolved promise of that value. You can use either the `new Promise` or `.resolve` syntax, but make sure you understand both!

```js
// example code in lieu of tests
resolvedWrapper(10).then(console.log)
// 10
```

# question 2: rejectedWrapper
The other side of the promise coin is rejection. Let's write a function that takes in a string message, and rejects with a [new error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/Error) with that string as the error's message.

Why are we rejecting with an error instead of just a value? Because it's best practice! Don't *throw* a new error, that's bad, just return an error object. You can use either the `new Promise` or `.reject` shortcut, but make sure you understand both!

```js
// example code in lieu of tests
resolvedWrapper('Oh no!').catch(console.log)
// Error: Oh no!
resolvedWrapper('Oh no!').catch((err) => console.log(err.message))
// Oh no!
```

# Question 3: thenWrapper
OK, we've made promises, but how do we deal with them? Write a function `thenWrapper`. All it does is take in a promise and using `.then`, grab the promise's resolved value, console.log it, and then return it!

```js
thenWrapper(Promise.resolve('yo')).then(val => val)
// logs "yo"
// and we still have access to yo since it's returned
```

# Question 4: thenCatchWrapper
Write a new function `thenCatchWrapper`. It also takes in a promise, but this time let's handle any errors as well.

If the passed in promise resolves, handle it with `.then`, just like before. However, the promise could reject, so you need to add a `.catch` as well. In the event of an error:
- log out "Your error message was: [error message]"
  - do not just log the error object itself! Use the `.message` property
- And then return `null`

```js
thenCatchWrapper(Promise.resolve('yo')).then(val => val)
// logs "yo"
// and we still have access to yo since it's returned

thenCatchWrapper(Promise.reject(Error('Yikes!'))).then(val => val === null)
// logs Your error message was: Yikes!
// the final return value is null
```

# Question 5: pauseForMs
As you learned, JS gives us timers, [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) and [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout). Let's look at `setTimeout` which takes a callback and then calls it after a number of milliseconds have passed:

```js
const myCallback = () => {
  console.log("Delayed for 1 second.");
};

setTimeout(myCallback, 1000);
```

That's cool and all, but it's not a promise. Your mission is to use `setTimeout` to create an asynchronous function `pauseForMs` that takes in a number of milliseconds. To do this, you must convert `setTimeout` into a promise. `pauseForMs` won't resolve a value, but it *will* resolve so we can latch onto and wait for it with `.then`. No rejections necessary!

```js
pauseForMs(1000).then(() => {
  console.log("It's been a second!");
});
// that logs after a second passes
```

# Question 6 - return4RandomColors

As we talked about earlier, callback hell is when you have to nest callback functions, and it's the main motivation for making promises in the first place.

Look at the `get4RandomColorsOld` function below. It uses a callback based `crypto.randomFill` function to get an array of 3 random numbers, and then it feeds those into a helper function to make `rgb` strings. But since it's callback based, the only way to get our `rgb` strings array is to pass in *another* callback. Look:

```js
const numsToRGBColor = ([color1, color2, color3]) => {
  return `rgb(${color1}, ${color2}, ${color3})`;
};

const get4RandomColorsOld = (useColorsCallback) => {
  const colors = [];
  crypto.randomFill(new Uint8Array(3), (err1, buffer1) => {
    if (err1) throw new Error(err1);
    colors.push(numsToRGBColor([...buffer1]));

    crypto.randomFill(new Uint8Array(3), (err2, buffer2) => {
      if (err2) throw new Error(err2);
      colors.push(numsToRGBColor([...buffer2]));

      crypto.randomFill(new Uint8Array(3), (err3, buffer3) => {
        if (err3) throw new Error(err3);
        colors.push(numsToRGBColor([...buffer3]));

        crypto.randomFill(new Uint8Array(3), (err4, buffer4) => {
          if (err4) throw new Error(err4);
          colors.push(numsToRGBColor([...buffer4]));

          useColorsCallback(colors);
        });
      });
    });
  });
};

get4RandomColors((colors) => console.log('colors:', colors));
```
## Analyzing the code
Blech, what a mess! Ok, so let's start by figuring out what this is really doing. First, let's break down what the `randomFill` function does. It looks like this:

```js
crypto.randomFill(new Uint8Array(3), (err, buffer) => { ... });
```
It takes 2 arguments, a buffer structure (here an array with 3 numbers 0-255 in it), and a callback function. If there's an error it'll be the first argument, if there's no error `err` will equal `null` and `buffer` will have the array of numbers in it. So far so good.

Then, it looks like we convert the buffer into an array by spreading it, and then passing it into a helper function that turns it into an RGB string.

We do this 4 times with callbacks, and then *finally* to use our 4 colors, we need to pass in a final callback to access the array. What a pain, this is the only way to get all 4 colors.

Instead of using callback hell, promises keep everything linear by allowing you to chain `then`s and `catch`. Your mission is to use this code in `modify.js`:

```js
const crypto = require('crypto');

const numsToRGBColor = ([color1, color2, color3]) => {
  return `rgb(${color1}, ${color2}, ${color3})`;
};

const getRandomBytes = () => new Promise((resolve, reject) => {
  crypto.randomFill(new Uint8Array(3), (err, buffer) => {
    if (err) return reject(err);
    resolve([...buffer]);
  });
});

const return4RandomColors = () => {
  const colors = [];
  return getRandomBytes()
    .then(() => {
    })
    .then(() => {
    })
    .then(() => {
    })
    .then(() => {
    })
    .catch((err) => {
      console.error(err);
    });
};

return4RandomColors().then(console.log)
// logs the array with 4 colors [ 'rgb(105, 178, 206)' ... ]
```

And make it so that `return4RandomColors` returns a promised array of `rgb` strings. Do not modify `numsToRGBColor` or `getRandomBytes` alright? Just use them!

## DUDE. What even is this?
Does this code confuse you? Honestly, that's ok! We intentionally chose something over engineered (spoiler alert, you do not need `crypto` and buffers to make arrays with 3 numbers in them) because you will see this *all* the time at work. The meta challenge here is to understand the code *enough* to get your job done.

Carefully read through the starting code (call it, copy it into `playground`, whatever) and then once you have a handle on it, set out on modifying it. You can do this!

# Short Answers
These are important, don't skip them!

# Bonus
After you've gotten your tests passing and answered all your short answers, try these additional challenges on for size!

- `async/await`
  - Don't use them on this assignment but there's a modern way of writing promises with the `async` and `await` keywords. We'll use them later this week, but you can start reading about them now to get a leg up!
- Multiple promises
  - So in our `return4RandomColors` we asked you to use a promise chain. HOWEVER, there is *another* way. See, if none of your promises require data from each other (the 4 random colors don't care about each other for example), you can also use `Promise.all` to work through multiple promises. Write a new function `return4RandomColorsBetter` that uses `Promise.all` to get things done.


