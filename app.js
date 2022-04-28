//settings
const minVisibleTime = 250;
const maxVisibleTime = 1000;
const minDelayTime = 50;
const maxDelayTime = 450;
const gameTime = 30;

//selectors
const [...holes] = document.querySelectorAll(".grid-item");
const startBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");

const scoreInfo = document.querySelector(".score");
const timeInfo = document.querySelector(".time");
const personalBestInfo = document.querySelector(".personal-best");
const hitInfo = document.querySelector(".pow");

//global variables
let isRunning = false;
let lastHole = null;
let timeLeft = gameTime;
let score = 0;

//intervals
let [timeLeftInterval, visibleTimeout, nextBugDelayTimeout] = [null, null, null];

//functions
const randomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomHole = () => holes[randomFromRange(0, holes.length - 1)];
const randomVisibleTime = () => randomFromRange(minVisibleTime, maxVisibleTime);
const randomDelayTime = () => randomFromRange(minDelayTime, maxDelayTime);

const showBug = (hole) => hole.classList.add("active");
const hideBug = (hole) => hole.classList.remove("active");
const showNextBugAfterDelay = () => (nextBugDelayTimeout = setTimeout(showRandomBug, randomDelayTime()));

const showRandomBug = () => {
  const hole = randomHole();

  if (lastHole === hole) {
    lastHole = hole;
    showRandomBug();
    return;
  }
  lastHole = hole;

  showBug(hole);

  visibleTimeout = setTimeout(() => {
    hideBug(hole);
    showNextBugAfterDelay();
  }, randomVisibleTime());
};

function hitDetection() {
  const selectedHole = this;

  if (selectedHole.classList.contains("active")) {
    showHitInfo();
    scoreInfo.textContent = ++score;
    clearTimeout(visibleTimeout);
    hideBug(selectedHole);
    showNextBugAfterDelay();
  }
}

const showHitInfo = () => {
  hitInfo.style.opacity = "1";
  setTimeout(() => {
    hitInfo.style.opacity = "0";
  }, 350);
};

const changeButtons = () => {
  isRunning = !isRunning;
  startBtn.style.display = isRunning ? "none" : "block";
  resetBtn.style.display = isRunning ? "block" : "none";
};

const savePersonalBest = () => {
  const personalBest = localStorage.getItem("PB");
  if (score > personalBest) {
    localStorage.setItem("PB", score);
    personalBestInfo.textContent = score;
  }
};

const startGame = () => {
  changeButtons();
  showRandomBug();
  scoreInfo.textContent = 0;
  timeLeftInterval = setInterval(() => {
    timeInfo.textContent = --timeLeft;
    if (!timeLeft) {
      savePersonalBest();
      clearGame();
    }
  }, 1000);
};

const clearGame = () => {
  changeButtons();

  holes.forEach((hole) => hideBug(hole));
  score = 0;
  timeInfo.textContent = timeLeft = gameTime;
  clearInterval(timeLeftInterval);
  clearTimeout(visibleTimeout);
  clearTimeout(nextBugDelayTimeout);
};

const initGame = () => {
  const personalBest = localStorage.getItem("PB");
  personalBestInfo.textContent = personalBest || 0;
  timeInfo.textContent = timeLeft;
  holes.forEach((hole) => hole.addEventListener("click", hitDetection));
  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", clearGame);
};

initGame();
