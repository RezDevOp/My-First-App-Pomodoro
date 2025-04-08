// Timer durations in seconds
const TIMER_MODES = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

// Get DOM elements
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const pomodoroBtn = document.getElementById("pomodoro");
const shortBreakBtn = document.getElementById("shortBreak");
const longBreakBtn = document.getElementById("longBreak");

// Timer state
let timeLeft = TIMER_MODES.pomodoro;
let timerId = null;
let isRunning = false;
let currentMode = "pomodoro";

// Update the timer display
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  minutesDisplay.textContent = minutes.toString().padStart(2, "0");
  secondsDisplay.textContent = seconds.toString().padStart(2, "0");
}

// Start the timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    timerId = setInterval(() => {
      timeLeft--;
      updateDisplay();

      if (timeLeft === 0) {
        clearInterval(timerId);
        isRunning = false;
        switchMode(currentMode === "pomodoro" ? "shortBreak" : "pomodoro");
      }
    }, 1000);
  }
}

// Pause the timer
function pauseTimer() {
  if (isRunning) {
    clearInterval(timerId);
    isRunning = false;
  }
}

// Reset the timer
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = TIMER_MODES[currentMode];
  updateDisplay();
}

// Switch timer mode
function switchMode(mode) {
  currentMode = mode;
  timeLeft = TIMER_MODES[mode];
  isRunning = false;
  clearInterval(timerId);
  updateDisplay();

  // Update active button
  [pomodoroBtn, shortBreakBtn, longBreakBtn].forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(mode).classList.add("active");
}

// Event listeners
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
pomodoroBtn.addEventListener("click", () => switchMode("pomodoro"));
shortBreakBtn.addEventListener("click", () => switchMode("shortBreak"));
longBreakBtn.addEventListener("click", () => switchMode("longBreak"));

// Initialize display
updateDisplay();
