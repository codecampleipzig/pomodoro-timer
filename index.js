const Timer = {
  template: `<div class="timer">
  <div class="countdown" :class="{running: timerIsRunning}"
  :style="countdown == 0 ? {color: 'darkorange'} : {}">{{ formattedCountdown }}</div>
  <input
    type="text"
    v-model="inputTaskName"
    placeholder="What are you working on?"
  />
  <div class="countdown-controls">
    <button class="icon" @click="startTimer">
      <img :src="timerIsRunning ? 'img/icon-rewind.svg' : 'img/icon-play.svg'"></img>
    </button>
    <button class="icon" :disabled="!(countdown == 0 || timerIsRunning)" @click="stopTimer">      <img src="img/icon-stop.svg"></img></button>
  </div>
</div>`,
  props: {
    duration: {
      type: Number,
      default: 5000,
    },
  },
  data() {
    return {
      countdown: 0,
      intervalHandle: null,
      inputTaskName: "",
    };
  },
  computed: {
    formattedCountdown() {
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
      return formatCountdown(this.countdown);
    },
    timerIsRunning() {
      return this.intervalHandle != null;
    },
  },
  methods: {
    startTimer() {
      this.stopTimer();
      const startTime = Date.now();
      const endTime = startTime + this.duration;

      this.intervalHandle = setInterval(() => {
        const remainingTimeInMs = endTime - Date.now();
        if (remainingTimeInMs > 0) {
          this.countdown = remainingTimeInMs;
        } else {
          this.clearTimer();
          this.countdown = 0;
          this.$emit("completed", {
            task: this.inputTaskName,
            startedAt: startTime,
          });
        }
      }, 1000);
    },
    stopTimer() {
      this.clearTimer();
      this.countdown = this.duration;
    },
    clearTimer() {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    },
  },
  created() {
    this.stopTimer();
  },
};

Vue.component("timer", Timer);

const app = new Vue({
  el: "#app",
  data() {
    return {
      history: [],
    };
  },
  methods: {
    clearHistory() {
      localStorage.removeItem("history");
      this.history = [];
    },
    addToHistory(entry) {
      this.history.push(entry);
      localStorage.setItem("history", JSON.stringify(this.history));
    },
  },
  created() {
    const storedHistory = localStorage.getItem("history");
    if (storedHistory != null) {
      this.history = JSON.parse(storedHistory);
    }
  },
});
