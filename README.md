---
title: Pomodoro Timer
type: Project
subject: Projects
---

## Goal

The goal of this project is to build a simple Pomodoro Timer.
The base functionality is that there is a countdown which can be started and stopped and the remaining time ought to be always visible on the screen.
Additionally we can specify for each pomodoro what task we are working on.
Once the time has run out the pomodoro will be stored in a history.
The history data will only be stored locally in the browser, but will persist between page reloads.

<h2 class="challenge" id="pomodoro-timer" data-points="5">Timer</h2>

First we are going to implement the timer.

### Setup

Create an index.html, index.js and style.css file and link the css and js file into the html file.
Either add the `<script>` tag to the bottom of the body element or in the head with the attribute `defer`.

We need three HTML elements for this to work: A countdown display to show the remaining time, a start button and a stop button.

You can lay them out however you want on the screen and put them into containers, but make sure to give them the ids `countdown`, `start` and `stop` so the javascript code you will find later will work with your html.

```html
<div id="countdown"></div>
<button id="start">Start</div>
<button id="stop">Stop</div>
```

We will have to implement two functions: `startTimer` and `stopTimer` and add them as eventListeners to the start and stop button.
Try to set the source code up yourself. Leave the startTimer and stopTimer functions empty.
This time use `document.getElementById` instead of the querySelector to get a reference to the html elements. It's in general the better choice, because querying for an id is quicker than using an arbitrary css selector.
We will also need a handle to the countdown display, so at the top of your file create a variable `countdown` and use again document.getElementById to get a reference to the countdown div.

Here's the structure in case you get lost:

```js
const countdown = document.getElementById("countdown");
function startTimer() {}
function stopTimer() {}
document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
```

### Start Timer

When the start button is pressed we want to first store the current time in a variable and then compute the end time.
The function Date.now() returns a millisecond counter, i.e. the number of milliseconds that have passed since 1.1.1970.
For testing purposes we'll only have a countdown for 5 seconds, i.e. we'll add 5000 to the current time.

In startTimer first store the startTime and then compute the endTime from there.

```js
const startTime = Date.now();
const endTime = startTime + 5000;
```

Perfect, now everything we need to do is create an interval Timer that get's called every second to update the countdown element with the remaining time in seconds. When the remaining time reaches a value lower than zero, we know we have moved passed the endTime and should stop the Timer. The function to create an Interval Timer is called `setInterval` and will take two arguments: a function to be called for every interval and the intervalDuration in milliseconds.

Below you'll find the code to change the countdown display to the current value of the milliseconds timer every second. Insert the code in your project and try to change it, so it displays the remaining time instead. You have to use the variable endTime to compute the remainingTime.

```js
setInterval(() => {
  const now = Date.now();
  countdown.textContent = now;
}, 1000);
```

Try it out. Can you predict what will happen on the screen after 5 seconds?

If you done it right the timer starts showing you negative numbers. That's the point where the countdown should just be set to 0 and the interval should stop. To stop the timer we have to use the handle that is returned by setInterval.

So first change the code you just wrote slightly like this

```js
// We capture the return value in a variable called intervalHandle
const intervalHandle = setInterval(() => {
  const remainingTimeInMs = endTime - Date.now();
  countdown.textContent = remainingTimeInMs;
}, 1000);
```

To stop the interval you can now use the following statement

```js
clearInterval(intervalHandle);
```

Now try to change the code in the function passed to setInterval so when remainingTimeInMs is **less than or equal** to zero the interval will be stopped and the textContent of countdown will be set to excatly 0.

Why do we need to be able to handle negative values? Shouldn't we expect that there'll be a call to setInterval, where the remainingTime is exactly 0?

### Stop Timer

Now we also have to implement the stop timer, so the timer can be canceled when necessary.
We already know which statement will stop the Timer

```js
clearInterval(intervalHandle);
```

Try adding this to the stopTimer function and test it. It won't work, but can you explain why?

The stopTimer function doesn't have access to the intervalHandle, because it gets defined in the startTimer function.
The proper way to describe this situation is to say: intervalHandle is not in the scope of stopTimer.

In order to solve this problem we have to move the definition of intervalHandle into the global scope, meaning **before** the function.
The startTimer function will not define the intervalHandle, but just use it. More precisely it will asign a new value to it.
This also means we have to switch from `const` to `let` for the intervalHandle variable.

See if you can make this work. If you get stuck here's a full view of how your source code file can look.

### Solution

index.js

```js
const countdown = document.getElementById("countdown");

// If defined here, both startTimer and stopTimer can *see* the intervalHandle.
let intervalHandle = null;

function startTimer() {
  const startTime = Date.now();
  const endTime = startTime + 5000;

  // Here we have a reassignment instead of the variable definition
  intervalHandle = setInterval(() => {
    const remainingTimeInMs = endTime - Date.now();
    if (remainingTimeInMs > 0) {
      countdown.textContent = remainingTimeInMs;
    } else {
      clearInterval(intervalHandle);
      countdown.textContent = 0;
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalHandle);
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);
```

### Improvements

- Make the duration of the countdown a global variable, so you can quickly change it.
- At startup the countdown display is empty, set it to display the duration of the countdown instead using Javascript.
- When you click the start button multiple times before the countdown was stopped you actually get multiple intervals which can't be stopped anymore.
- If the timer is stopped the countdown stays at the value it was last set to. Try to reset it to the full duration of the countdown, i.e. 5000.
- Displaying the countdown in milliseconds is not exactly the most useful way of displaying a countdown to the user. Try implementing a function `formatCountdown(timeInMs)` that returns a string which shows the time in minutes and seconds, e.g. `01:59`. Then use that function wherever countdown.textContent gets reset. Here's a starting point

```js
function formatCountdown(timeInMs) {
  const minutes = ??;
  const seconds = ??;
  return `${}`;
}
```

The difficult part in this exercise is actually to add leading zeros, when the number of seconds is less than 10, so you always keep 2 digits for the seconds. Try implementing a function `addZeroPadding(str)` that adds a zero to a string if it only contains one character. Then use that inside formatCountdown.

<h2 class="challenge" id="pomodoro-history" data-points="8">History</h2>

The app is already useable, but it would be nice to be able to keep a history of all the pomodoro's we have finished.
Then we can get a clear overview of what we have been working on and for how long.

### Data Modelling

For each finished pomodoro interval we want to store:

1. the name of the task.
2. the start time of the task as a millisecond counter since epoche.

We'll store them in an object that would look like this.

```js
const pomodoro = {
  task: "Add history feature to pomodoro timer",
  startedAt: 1586108217767,
};
```

We'll keep track of our history by storing a global array of these tasks and then add data to it.
After we have finished a second task it might look like this.

```js
let history = [
  {
    task: "Add history feature to pomodoro timer",
    startedAt: 1586108217767,
  },
  {
    task: "Review javascript arrays",
    startedAt: 1586108356155,
  },
];
```

But at the start of the application it will actually be completely empty.
Add this line of javascript code to your Javascript file.

```js
let history = [];
```

### Input element

In order for the user to be able to tell us what the name of the task is we need an extra html element.
Add an input box like this to your html page. Use the id `task-name-input` and create a global variable called taskNameInput to hold a reference to this element.

index.html

```html
<input type="text" id="task-name-input" />
```

index.js

```js
const taskNameInput = document.getElementById("task-name-input");
```

### addToHistory

Now we are going to implement the actual history functionality. Add a new function called `addToHistory` which takes 2 arguments: the taskName and the startTime. Whenever this function is called it should combine the two arguments into an object and push them to the end of the history array.
Try if you can figure out how to implement the function, if you get stuck you can take a look at this reference, but resist the copy paste temptation.

```js
function addToHistory(task, startedAt) {
  history.push({
    task: task,
    startedAt: startedAt,
  });
}
```

Code like the one from above is so common that a short form got invented and added to the javascript standard. Take a look at this code which does the exact same thing. This shorthand trick works whenever the name of a variable and the key we want to insert it at in an object are the same.

```js
function addToHistory(task, startedAt) {
  history.push({
    task,
    startedAt,
  });
}
```

Even the best function is worth nothing if it never gets called. We will have to call it whenever the countdown reaches 0. Luckily we have already an if else branch that matches exactly that scenario. Last thing you need is the syntax to get access to the content of the `<input>` element. We should already have the taskNameInput element as a global variable. This is the expression to get the value of the input form element

```js
const taskName = taskNameInput.value;
```

Again try to add the call to the function yourself and only refer back to the solution at the end of the tutorial if you really get stuck.

If you want to check wheter your code is working, run a couple of pomodoros (reset the default duration to something like 2 seconds first) and open the javascript console in the browser. Then type: `history` and hit enter to see the value stored in the variable.

### Displaying the history

The data layer of the history feature is working, however we also want to display the data to the user.
Add an empty unordered list item to your html document and give it the id `history-list` and create a global binding to the element in your javascript, called historyList.

```html
<ul id="history-list"></ul>
```

```js
const historyList = document.getElementById("history-list");
```

Now, whenever the history changes, we want to clear the historyList and add all the items from the history array to it.
We'll implement this inside a new function called `updateDisplay`, which will take no arguments.
Create that function and call it at the end of the addToHistory function.

A quick and dirty way to clear an html elements content, is to set it's innerHTML property to the empty string, like this.

```js
historyList.innerHTML = "";
```

So that's the first line of code in the updateDisplay function.
Next we have to iterate over the elements in the history array. Let's setup the boilerplate to do so using the forEach method on the history array.

```js
history.forEach((entry) => {
  // Here we can do something for each entry.
});
```

So what do we have to do with each entry? We want to create a list, so we have to create an `<li>` element for each of them and add it to the `<ul id="history-list">` element.

We haven't seen the way that this can be done in Javascript yet, so here's a quick summary of the functions we'll use.

The function to create a new html element from javascript is in general very important and looks like this

```js
const li = document.createElement("li")`
```

The argument here is the name of the html tag. It could have also been `div`, `a`, `h3`, etc...
The function returns a completely new html element, which is not part of the document yet.
Instead it is only accessible in javascript and we can set attributes or it's textContent or add children to it.
Here's an example:

```js
li.textContent = `${entry.startedAt} ${entry.task}`;
```

Once it's prepared to set foot on the stage of our website, we just append it as a child to an existing element. Then it will immediately become a part of the html document and visible to the user.

```js
historyList.appendChild(li);
```

Try to put these pieces together in the updateDisplay function.
In case you need help, here's a possible implementation.

```js
let history = [];
const historyList = document.getElementById("history-list");

function updateDisplay() {
  historyList.innerHTML = "";
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.startedAt} ${entry.task}`;
    historyList.appendChild(li);
  });
}

function addToHistory(task, startedAt) {
  history.push({
    task,
    startedAt,
  });
  updateDisplay();
}
```

One thing that's obviously annoying is that it will display the milliseconds counter as the date. You can change that by creating a Date object using the Date constructor and passing it the milliseconds counter as an argument. This would look like this

```js
const startedAtDate = new Date(entry.startedAt);
```

Try to adjust the code you have to incorporate this. If you are interested in learning more about Date objects refer to this reference:

[w3schools: Dates](https://www.w3schools.com/js/js_dates.asp)

### Persistency

Now everything should be working. Once a pomodoro is finished it should immediately appear in the history list. But we have one problem. What happens if the browser gets refereshed? Our history is again completely empty. Can you explain how the data gets lost?

So how do we persist the data, so it survives a refresh? The answer is the localStorage API.
Every browser has the capability to store local data for a web page permanently. This is often used to cache some security token, so you don't have to enter your password everytime you visit the web page. If you open any website in the chrome developer tools you can actually take a look at all the data that got stored by going to the Application tab and selecting Local Storage from the menu.

The localStorage is organized as a key-value store, where both the key and the value are **strings**. The API provides three main functions:

- `localStorage.setItem(key, value)`
- `localStorage.getItem(key)`
- `localStorage.removeItem(key)`

When are we going to use these functions? First whenever an entry is added to the history, we want to set an item in the local storage to contain the full list of our history.
But just storing the data won't be enough, we also have to load the item from localStorage in our startup code.
Let's implement these functionalities in two functions called `storeHistory` and `loadHistory`.
Setup the code for these two functions and also call the `loadHistory` function as part of your startup routine.

One thing we have to be aware of is that as I said the localStorage doesn't store any javascript value. It can only store strings.
Luckily there's a nice way to convert javascript values into strings and back again using JSON, which stands for Javascript Object Notation.
If you want to convert an object into JSON you have to call `JSON.stringify`. If you want to get the value converted back you use `JSON.parse`. Notice that these two functions are not able to capture every value perfectly, e.g. functions can't be converted back and forth from JSON. But for most atomic data and arrays and objects only containing such data this works really well.
Here's some example code to help you get started on the `storeHistory` and `loadHistory` functions. You'll find the full implementation at the end of the section.

```js
// Storing the history in localStorage
localStorage.setItem("history", JSON.stringify(history));

// Check if item exists in local storage using an if statement
if (localStorage.getItem("history") != null) {
}

// Loading the history from localStorage
const storedHistoryAsString = localStorage.getItem("history");

// Parsing the JSON string that got stored in localStorage
const storedHistoryAsArray = JSON.parse(storedHistoryAsString);
```

### Improvements

- Sometimes a user might want to completely clear the history. Try implementing a clear history button using the localStorage.removeItem function. Don't forget to also update the global history variable and call updateDisplay.

### Solution

```js
let history = [];
const historyList = document.getElementById("history-list");

function updateDisplay() {
  historyList.innerHTML = "";
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.startedAt} ${entry.task}`;
    historyList.appendChild(li);
  });
}

function addToHistory(task, startedAt) {
  history.push({
    task,
    startedAt,
  });
  updateDisplay();
  storeHistory(); // Store history whenever an item is added to the history.
}

function storeHistory() {
  localStorage.setItem("history", JSON.stringify(history));
}

function loadHistory() {
  const storedHistory = localStorage.getItem("history");
  if (storedHistory != null) {
    history = JSON.parse(storedHistory);
    updateDisplay();
  }
}

// Load history at startup
loadHistory();
```

<h2 class="challenge" id="pomodoro-refactoring" data-points="3">Refactoring</h2>

The problem we are facing is that the index.js file is getting to long to navigate. It's time to move some functionality into separate files and just interface with it from the index.js file through a few well defined functions.

Create a new directory for all your javascript source code called js and create a timer.js and a history.js file.
Then link all javascript files in the right order into the html file and move all the timer related source code into timer.js and all history related sourcecode into history.js

### Advanced Refactoring: Abstraction

Another thing you can do is to extract the specific functionality of our timer from the startTimer function to make it more general.

Instead of having no parameters, the startTimer function could take the length of the countdown as an argument.
Additionally we can also extract the code that should be run on every tick and the code that should be run once the countdown is finished as arguments.

Then we can call startTimer and just provide callback functions in which we specify what should happen every second and at the end of the countdown.

If this is our starting point:

```js
function startTimer() {
  stopTimer(); // This solves the problem of potentially starting multiple timers.
  const startTime = Date.now();
  const endTime = startTime + 5000;

  intervalHandle = setInterval(() => {
    const remainingTimeInMs = endTime - Date.now();
    if (remainingTimeInMs > 0) {
      countdown.textContent = remainingTimeInMs;
    } else {
      clearInterval(intervalHandle);
      countdown.textContent = 0;
      addToHistory(inputFormName.value, startTime);
    }
  }, 1000);
}

document.getElementById("start").addEventListener("click", startTimer);
```

We could end up with this. Both tickCallback and finishedCallback have to be bound to functions by the caller.
We'll pass the remaining time to the tickCallback and the startTime to the finishedCallback.

```js
function startTimer(durationInMs, tickCallback, finishedCallback) {
  stopTimer();
  const startTime = Date.now();
  const endTime = startTime + durationInMs;

  intervalHandle = setInterval(() => {
    const remainingTimeInMs = endTime - Date.now();
    if (remainingTimeInMs > 0) {
      tickCallback(remainingTimeInMs);
    } else {
      clearInterval(intervalHandle);
      finishedCallback(startTime);
    }
  }, 1000);
}

function tick(remainingTime) {
  countdown.textContent = remainingTime;
}

function countdownFinished(startTime) {
  countdown.textContent = "0";
  addToHistory(inputFormName.value, startTime);
}

document.getElementById("start").addEventListner("click", () => {
  startTimer(5000, tick, countdownFinished);
});
```

Is this really an improvement you might ask? At the end that's up to everyone to decide, but do you notice how our startTimer and stopTimer function now contain absolutely nothing that makes them specific to our application?
This means they could be used in many different contexts. We have implemented an abstract countdown timer.
Also if we want to change something about our application, that code is now nicely isolated from the implementation of the timer logic in the tick and countdownFinished function. All bugs we'll create in the future will hopefully be localized in those functions.

<h2 class="challenge" id="pomodoro-styling" data-points="5">Styling</h2>

It might be working, but it doesn't look good. Take some time to create a decent styling, but only aim for solid right now. If you are interested in

<h2 class="challenge" id="pomodoro-deploy" data-points="3">Deploy</h2>

Deploy your app to github Pages or netlify (your choice) so you can start using it to track your work. You can also share it with others.

<h2 class="challenge" id="pomodoro-features" data-points="3">Extended Features</h2>

- Improve the styling
- Add an explanation of the Pomodoro technique.
- Settings: Make it possible to change the duration.
- Play a sound at the end of the countdown. Research the `<audio>` html element
- Add a countdown bar, that visualizes the amount of time left until the time is over.
- Show the remaining time in the document.title
- Use the Notification API to display a notification once a pomodoro is finished
