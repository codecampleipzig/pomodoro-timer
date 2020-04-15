const app = new Vue({
  el: "#app",
  data: {
    countdown: 0,
    iconPlay: "../img/icon-play.svg",
    iconRewind: "../img/icon-rewind.svg",
    intervalHandle: null,
    history: [],
  },
  methods: {
    startTimer: function () {
      stopTimer();
      const startTime = Date.now();
      const endTime = startTime + countdownDurationInMs;

      app.intervalHandle = setInterval(() => {
        const remainingTimeInMs = endTime - Date.now();
        if (remainingTimeInMs > 0) {
          app.countdown = remainingTimeInMs;
        } else {
          clearInterval(app.intervalHandle);
          app.intervalHandle = null;
          app.countdown = 0;
          addToHistory(inputTaskName.value, startTime);
        }
      }, 1000);
    },
    stopTimer: function () {
      clearInterval(app.intervalHandle);
      app.intervalHandle = null;
      app.countdown = countdownDurationInMs;
    },
    clearHistory: function () {
      localStorage.removeItem("history");
      app.history = [];
    },
  },
});

// Utilities for Countdown Formatting
function addZeroPadding(str) {
  str = String(str);
  if (str.length == 1) {
    return `0${str}`;
  } else {
    return str;
  }
}
function formatCountdown(milliseconds) {
  const seconds = Math.round(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);

  return `${minutes}:${addZeroPadding(seconds % 60)}`;
}

// Timer
// const countdown = document.getElementById("countdown");
const inputTaskName = document.getElementById("input-task-name");
const countdownDurationInMs = 5000;

function startTimer() {
  stopTimer();
  const startTime = Date.now();
  const endTime = startTime + countdownDurationInMs;

  app.intervalHandle = setInterval(() => {
    const remainingTimeInMs = endTime - Date.now();
    if (remainingTimeInMs > 0) {
      app.countdown = remainingTimeInMs;
    } else {
      clearInterval(app.intervalHandle);
      app.intervalHandle = null;
      app.countdown = 0;
      addToHistory(inputTaskName.value, startTime);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(app.intervalHandle);
  app.intervalHandle = null;
  app.countdown = countdownDurationInMs;
}

// Reset display at startup
app.countdown = countdownDurationInMs;

// document.getElementById("start").addEventListener("click", startTimer);
// document.getElementById("stop").addEventListener("click", stopTimer);

function addToHistory(task, startedAt) {
  app.history.push({
    task,
    startedAt,
  });
  storeHistory(); // Store app.history whenever an item is added to the history.
}

function storeHistory() {
  localStorage.setItem("history", JSON.stringify(app.history));
}

function loadHistory() {
  const storedHistory = localStorage.getItem("history");
  if (storedHistory != null) {
    app.history = JSON.parse(storedHistory);
  }
}
// Load history at startup
loadHistory();

// Clear History Feature
function clearHistory() {
  localStorage.removeItem("history");
  app.history = [];
}

// document
//   .getElementById("clear-history")
//   .addEventListener("click", clearHistory);
