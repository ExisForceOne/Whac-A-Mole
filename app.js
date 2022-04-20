//settings
const minVisibleTime = 250;
const maxVisibleTime = 1000;
const nextBugDelay = 150;
const gameTime = 60;

//selectors
const [...holes] = document.querySelectorAll(".grid-item");
const startBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");

const scoreInfo = document.querySelector(".score");
const timeInfo = document.querySelector(".time");
const personalBestInfo = document.querySelector(".personal-best");

//global variables
let isRunning = false;
let lastHole = null;
let timeLeft = gameTime;
let score = 0;

//intervals
let timeLeftInterval = null;
let visibleTimeout = null;
let nextBugDelayTimeout = null;

//functions
const randomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomHole = () => holes[randomFromRange(0, holes.length - 1)];
const randomTime = () => randomFromRange(minVisibleTime, maxVisibleTime);

const showBug = (hole) => hole.classList.add("active");
const hideBug = (hole) => hole.classList.remove("active");
const showNextBugAfterDelay = () => (nextBugDelayTimeout = setTimeout(showRandomBug, nextBugDelay));

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
  }, randomTime());
};

function hitDetection() {
  const selectedHole = this;

  if (selectedHole.classList.contains("active")) {
    console.log("hit");
    scoreInfo.textContent = ++score;
    clearTimeout(visibleTimeout);
    hideBug(selectedHole);
    showNextBugAfterDelay();
  }
}

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

  timeLeftInterval = setInterval(() => {
    timeInfo.textContent = --timeLeft;
    !timeLeft ? clearGame() : null;
  }, 1000);
};

const clearGame = () => {
  changeButtons();
  savePersonalBest();
  holes.forEach((hole) => hideBug(hole));
  timeInfo.textContent = timeLeft = gameTime;
  scoreInfo.textContent = score = 0;
  clearInterval(timeLeftInterval);
  clearTimeout(visibleTimeout);
  clearTimeout(nextBugDelayTimeout);
};

const initGame = () => {
  const personalBest = localStorage.getItem("PB");
  personalBestInfo.textContent = personalBest ? personalBest : 0;
  timeInfo.textContent = timeLeft;
  holes.forEach((hole) => hole.addEventListener("click", hitDetection));
  startBtn.addEventListener("click", startGame);
  resetBtn.addEventListener("click", clearGame);
};

initGame();
