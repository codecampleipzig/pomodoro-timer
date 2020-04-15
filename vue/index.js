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
    startTimer() {
      this.stopTimer();
      const startTime = Date.now();
      const endTime = startTime + countdownDurationInMs;

      this.intervalHandle = setInterval(() => {
        const remainingTimeInMs = endTime - Date.now();
        if (remainingTimeInMs > 0) {
          this.countdown = remainingTimeInMs;
        } else {
          clearInterval(this.intervalHandle);
          this.intervalHandle = null;
          this.countdown = 0;
          addToHistory(inputTaskName.value, startTime);
        }
      }, 1000);
    },
    stopTimer() {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
      this.countdown = countdownDurationInMs;
    },
    clearHistory() {
      localStorage.removeItem("history");
      this.history = [];
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
const inputTaskName = document.getElementById("input-task-name");
const countdownDurationInMs = 5000;

// Reset display at startup
app.countdown = countdownDurationInMs;

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
