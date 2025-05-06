// ********** DOM **********

// DOM elements
const secondsEl = document.querySelector('#seconds');
const minutesEl = document.querySelector('#minutes');
const hoursEl = document.querySelector('#hours');
const daysEl = document.querySelector('#days');

// Set target date and display it
const targetDate = new Date('May 6, 2025 15:00:00 UTC');
document.getElementById('target-date-display').textContent = 'Countdown to: May 6, 2025 15:00:00 UTC';

// pad 0s if digit is less than 10
const padZeros = num => {
  return num >= 0 && num < 10 ? `0${num}` : num;
};

// flip card on countdown
const flipCard = (el, card) => {
  card.addEventListener('transitionend', () => {
    const clonedCard = card.cloneNode(true);
    clonedCard.classList.remove('flipped');
    try {
      el.replaceChild(clonedCard, card);
    } catch (e) {
      console.log(e);
    }
    card = clonedCard;
  });
  if (!card.classList.contains('flipped')) {
    card.classList.add('flipped');
  }
};

// setup card
const setupCard = (el, currentTime, nextTime, resetTime) => {
  currentTime = padZeros(currentTime);
  nextTime = padZeros(nextTime);
  const card = el.querySelector('.card');
  const cardFaceFront = el.querySelector('.card-face__front');
  const cardFaceBack = el.querySelector('.card-face__back');
  el.setAttribute('data-current-number', currentTime);
  el.setAttribute('data-next-number', nextTime);
  cardFaceFront.innerText = currentTime;
  cardFaceBack.innerText = nextTime;
  resetTime && flipCard(el, card);
};

// update DOM countdown values
const updateDOM = (el, currentTime, resetTime) => {
  let nextTime = currentTime - 1;
  if (resetTime) {
    if (currentTime === 0) {
      nextTime = resetTime;
    } else if (currentTime === -1) {
      currentTime = resetTime;
      nextTime = resetTime - 1;
    }
  }
  setupCard(el, currentTime, nextTime, resetTime);
};

// Calculate time remaining
function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

// Update the countdown display
function updateCountdown() {
  const t = getTimeRemaining(targetDate);
  updateDOM(daysEl, t.days, 365); // Use a large reset value for days (or adjust as needed)
  updateDOM(hoursEl, t.hours, 24);
  updateDOM(minutesEl, t.minutes, 60);
  updateDOM(secondsEl, t.seconds, 60);
  if (t.total <= 0) {
    clearInterval(interval);
    console.log('END!!');
  }
}

// Initialize DOM with initial values
const t = getTimeRemaining(targetDate);
updateDOM(daysEl, t.days, 365);
updateDOM(hoursEl, t.hours, 24);
updateDOM(minutesEl, t.minutes, 60);
updateDOM(secondsEl, t.seconds, 60);

// Start the countdown
let interval = setInterval(updateCountdown, 1000);
