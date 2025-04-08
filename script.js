// Timer durations in seconds
const TIMER_MODES = {
  pomodoro: 25 * 60, // 25 minutes
  shortBreak: 5 * 60, // 5 minutes
  longBreak: 15 * 60, // 15 minutes
};

// Get DOM elements
const timer = document.querySelector(".timer");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");
const pomodoroBtn = document.getElementById("pomodoro");
const shortBreakBtn = document.getElementById("shortBreak");
const longBreakBtn = document.getElementById("longBreak");
const progressRing = document.querySelector(".progress-ring__circle");
const tickMarksGroup = document.getElementById("tick-marks");

// Focus elements
const focusModal = document.getElementById("focus-modal");
const focusInput = document.getElementById("focus-input");
const startFocusBtn = document.getElementById("start-focus");
const focusDisplay = document.getElementById("focus-display");
const focusText = document.getElementById("focus-text");

// Timer state
let timeLeft = TIMER_MODES.pomodoro;
let timerId = null;
let isRunning = false;
let currentMode = "pomodoro";
let currentFocus = "";

// Calculate the progress ring circumference
const circumference = 2 * Math.PI * 170; // 170 is the radius of our circle
progressRing.style.strokeDasharray = `${circumference}`;
progressRing.style.strokeDashoffset = `${circumference}`;

// Create tick marks
function createTickMarks(duration) {
  // Clear existing tick marks
  tickMarksGroup.innerHTML = "";

  const totalMinutes = Math.floor(duration / 60);
  const totalSeconds = duration;

  // Create second marks
  for (let i = 0; i < totalSeconds; i++) {
    // Calculate angle for clockwise rotation starting from 12 o'clock
    const angle = (360 / totalSeconds) * i;

    // Create the tick mark line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    // Set coordinates for a vertical line at the 12 o'clock position
    const innerRadius = i % 60 === 0 ? 110 : 120;
    const outerRadius = i % 60 === 0 ? 140 : 130;

    // Start with a vertical line at 12 o'clock
    line.setAttribute("x1", "150");
    line.setAttribute("y1", String(150 - outerRadius));
    line.setAttribute("x2", "150");
    line.setAttribute("y2", String(150 - innerRadius));

    // Rotate the line around the center point
    line.setAttribute("transform", `rotate(${angle}, 150, 150)`);
    line.setAttribute("class", i % 60 === 0 ? "tick-mark minute" : "tick-mark");

    tickMarksGroup.appendChild(line);
  }
}

// Update the timer display
function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Update progress ring
  const progress = timeLeft / TIMER_MODES[currentMode];
  const offset = circumference * (1 - progress);
  progressRing.style.strokeDashoffset = offset;
}

// Start the timer with focus prompt
function startTimer() {
  if (!isRunning) {
    if (currentMode === "pomodoro" && !currentFocus) {
      // Show focus modal
      focusModal.style.display = "flex";
      focusInput.focus();
    } else {
      startTimerCountdown();
    }
  }
}

// Start the actual timer countdown
function startTimerCountdown() {
  isRunning = true;
  timerId = setInterval(() => {
    timeLeft--;
    updateDisplay();

    if (timeLeft === 0) {
      clearInterval(timerId);
      isRunning = false;
      // Reset progress ring
      progressRing.style.strokeDashoffset = circumference;
      if (currentMode === "pomodoro") {
        currentFocus = ""; // Clear focus when pomodoro ends
        focusDisplay.style.display = "none";
      }
      switchMode(currentMode === "pomodoro" ? "shortBreak" : "pomodoro");
    }
  }, 1000);
}

// Handle focus submission
startFocusBtn.addEventListener("click", () => {
  const focus = focusInput.value.trim();
  if (focus) {
    currentFocus = focus;
    focusText.textContent = focus;
    focusDisplay.style.display = "block";
    focusModal.style.display = "none";
    focusInput.value = "";
    startTimerCountdown();
  }
});

// Handle Enter key in focus input
focusInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    startFocusBtn.click();
  }
});

// Reset timer and focus
function resetTimer() {
  clearInterval(timerId);
  isRunning = false;
  timeLeft = TIMER_MODES[currentMode];
  updateDisplay();
  // Reset progress ring
  progressRing.style.strokeDashoffset = circumference;
  // Reset focus
  currentFocus = "";
  focusDisplay.style.display = "none";
  focusInput.value = "";
}

// Pause the timer
function pauseTimer() {
  if (isRunning) {
    clearInterval(timerId);
    isRunning = false;
  }
}

// Switch timer mode
function switchMode(mode) {
  currentMode = mode;
  timeLeft = TIMER_MODES[mode];
  isRunning = false;
  clearInterval(timerId);
  updateDisplay();
  // Reset progress ring
  progressRing.style.strokeDashoffset = circumference;
  // Update tick marks for new mode
  createTickMarks(TIMER_MODES[mode]);

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

// Initialize display and tick marks
createTickMarks(TIMER_MODES.pomodoro);
updateDisplay();
