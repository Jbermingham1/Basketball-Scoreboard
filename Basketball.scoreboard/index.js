//keep state in module scope
let homeScore= 0
let guestScore= 0 
let homeFouls = 0
let guestFouls= 0
let period = 1;
let timerSeconds = 40 * 60 // 40:00 in seconds
let timerId = null;        // setInterval handle

//cache DOM once (faster/ cleaner)
const homeEl = document.getElementById("score-home-el")
const guestEl = document.getElementById("score-guest-el")
const homeFoulsEl = document.getElementById("home-fouls")
const guestFoulsEl = document.getElementById("guest-fouls")
const periodEl = document.getElementById("period-el")
const clockEl = document.getElementById("clock");

// Render everything derived from state
function renderScores() {
  //innerText avoids HTML injection and preserves the font
  homeEl.innerText = homeScore
  guestEl.innerText = guestScore
}

function renderFouls () {
  homeFoulsEl.innerText = homeFouls;
  guestFoulsEl.innerText = guestFouls;
}

function renderPeriod () {
  periodEl.innerText= period;
}

function formatClock(secs) {
  const m =Math.floor(secs / 60);
  const s = secs % 60;
  const mm= String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
  }


function renderClock() {
  clockEl.innerText= formatClock(timerSeconds);
}


//Generic increment heplper 
function increment(team,points) {
  //Check which team the caller meant and add the points to the score
  if (team === "home") {
    homeScore += points; //same as: homeScore= homeScore + points
  } else if (team === "guest") {
    guestScore += points; //same idea for guest team
  }
  //After we change state, re-render the UI so the screen matches the numbers
  renderScores();
}

// Expose the specific handlers the HTML calls
// (attaching to window because inline onclick looks for globals)

window.homeFreeThrow = () => increment ("home", 1);
// ^ create a property named "homeFreeThrow" on the global window object
//   value = a function that calls increment with team="home", points=1
window.homeMidRange = () => increment ("home", 2);
window.homeLongThree = () => increment ("home", 3);

window.guestFreeThrow = () => increment ("guest", 1);
window.guestMidRange = () => increment ("guest", 2);
window.guestLongThree = () => increment ("guest", 3);

// Initial paint (keeps things explicit)
renderScores(); // draw the starting 0–0 to the screen

// ---Fouls---
function addFoul(team) {
  if (team === "home") homeFouls += 1;
  else if (team === "guest") guestFouls += 1;
  renderFouls();
}

document.getElementById("home-foul-btn").addEventListener("click", () => addFoul("home"));
document.getElementById("guest-foul-btn").addEventListener("click", () => addFoul("guest"));

//--Winner Check--
document.getElementById("check-winner").addEventListener("click", () => {
  homeEl.classList.remove("winner");
  guestEl.classList.remove("winner");
  
  if (homeScore > guestScore) homeEl.classList.add("winner");
  if (guestScore > homeScore) guestEl.classList.add("winner");
  });


function stopTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  } 
}

//---Clock logic---
// tick every second while running
function tick() {
  if (timerSeconds > 0) {
    timerSeconds -= 1;
    renderClock();
    if (timerSeconds === 0) { // time's up: stop, advance period, reset clock (ready for next start)
      stopTimer();
      period += 1;
      renderPeriod();
      timerSeconds = 40 * 60;  // reset to 40:00 for next period
      renderClock();
    }
  }

function startTimer() {
  if (timerId !== null) return; // already running
  timerId = setInterval(tick, 1000); //1 tick per second
  }
  
  // Click the clock to toggle start/pause
  clockEl.addEventListener("click", () => {
    if (timerId) stopTimer();
    else startTimer();
  });
  
  // Spacebar toggles clock (accessibility)
  window.addEventListener("keydown", (e) => {
    if (e.code == "space") {
      e.preventDefault();
      if (timerId) stopTimer();
      else startTimer();
    }
  });

//---New game (full reset)---
document.getElementById("new-game").addEventListener("click", () => {
  homeScore = 0; guestScore = 0;
  homeFouls = 0; guestFouls = 0;
  period = 1;
  
  stopTimer();
  timerSeconds = 40 * 60;
  
  renderScores(); renderFouls(); renderPeriod(); renderClock();
  
  homeEl.classList.remove("winner");
  guestEl.classList.remove("winner");
});

//---Initial pain---
renderScores();
renderFouls();
renderPeriod();
renderClock();