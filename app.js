//settings
const minVisibleTime = 200;
const maxVisibleTime = 1000;
const nextVisibleBugDelay = 150;

//selectors
const [...holes] = document.querySelectorAll(".grid-item");

//event listeners
holes.forEach((hole) => hole.addEventListener("click", hitDetection));

//global variables
let lastHole = null;
let visibleTimeoutID = null;

//game
const randomFromRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomHole = () => holes[randomFromRange(0, holes.length - 1)];
const randomTime = () => randomFromRange(minVisibleTime, maxVisibleTime);

const showBug = (hole) => hole.classList.add("active");
const hideBug = (hole) => hole.classList.remove("active");

const showAnotherBug = (time) => setTimeout(hitMe, time);

function hitDetection() {
  const selectedHole = this;

  if (selectedHole.classList.contains("active")) {
    console.log("hit");
    clearTimeout(visibleTimeoutID);
    hideBug(selectedHole);
    showAnotherBug(nextVisibleBugDelay);
  }
}

const hitMe = () => {
  const hole = randomHole();
  const visibleTime = randomTime();

  showBug(hole);

  visibleTimeoutID = setTimeout(() => {
    hideBug(hole);
    showAnotherBug(visibleTime + nextVisibleBugDelay);
  }, visibleTime);
};
