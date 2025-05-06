// ********** DOM **********

const secondsEl = document.querySelector('#seconds');
const minutesEl = document.querySelector('#minutes');
const hoursEl = document.querySelector('#hours');
const daysEl = document.querySelector('#days');

// Set target date and display it
const targetDate = new Date('May 6, 2025 15:00:00 UTC');
if (document.getElementById('target-date-display')) {
  document.getElementById('target-date-display').textContent = 'Countdown to: May 6, 2025 15:00:00 UTC';
}

const padZeros = num => num >= 0 && num < 10 ? `0${num}` : num;

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
  // Only flip if resetTime is provided AND currentTime is not zero or nextTime is not zero
  if (resetTime !== null && (currentTime !== '00' || nextTime !== '00')) {
    flipCard(el, card);
  }
};

const updateDOM = (el, currentTime, resetTime) => {
  let nextTime = currentTime - 1;
  if (resetTime !== null) {
    if (currentTime === 0) {
      nextTime = resetTime;
    } else if (currentTime === -1) {
      currentTime = resetTime;
      nextTime = resetTime - 1;
    }
  }
  // Don't flip if time is up (currentTime is zero and nextTime is negative)
  if (currentTime === 0 && nextTime === -1) {
    nextTime = 0;
  }
  setupCard(el, currentTime, nextTime, resetTime);
};

function getTimeRemaining(endtime) {
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

function updateCountdown() {
  const t = getTimeRemaining(targetDate);
  // Only use reset value if days are greater than zero
  updateDOM(daysEl, t.days, t.days > 0 ? 365 : null);
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
updateDOM(daysEl, t.days, t.days > 0 ? 365 : null);
updateDOM(hoursEl, t.hours, 24);
updateDOM(minutesEl, t.minutes, 60);
updateDOM(secondsEl, t.seconds, 60);

// Start the countdown
let interval = setInterval(updateCountdown, 1000);
