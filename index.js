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
const countdown = document.getElementById("countdown");
const inputTaskName = document.getElementById("input-task-name");
const countdownDurationInMs = 1000;

// Global intervalHandle
let intervalHandle = null;

// Convenience function to make sure we always use the formatCountdown function when we display a countdown
function setCountdownDisplay(timeInMs) {
  countdown.textContent = formatCountdown(timeInMs);
}

function startTimer() {
  stopTimer();
  const startTime = Date.now();
  const endTime = startTime + countdownDurationInMs;

  intervalHandle = setInterval(() => {
    const remainingTimeInMs = endTime - Date.now();
    if (remainingTimeInMs > 0) {
      setCountdownDisplay(remainingTimeInMs);
    } else {
      clearInterval(intervalHandle);
      setCountdownDisplay(0);
      addToHistory(inputTaskName.value, startTime);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalHandle);
  setCountdownDisplay(countdownDurationInMs);
}

// Reset display at startup
setCountdownDisplay(countdownDurationInMs);

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("stop").addEventListener("click", stopTimer);

// History

let history = [];
const historyList = document.getElementById("history-list");

function updateDisplay() {
  historyList.innerHTML = "";
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${new Date(entry.startedAt).toLocaleString()} ${
      entry.task
    }`;
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

// Clear History Feature
function clearHistory() {
  localStorage.removeItem("history");
  history = [];
  updateDisplay();
}

document
  .getElementById("clear-history")
  .addEventListener("click", clearHistory);
