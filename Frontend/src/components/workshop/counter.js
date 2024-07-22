function updateCountdown(time) {
  const workshopDate = new Date(time);
  const now = new Date();
  const timeDifference = workshopDate - now;
  let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  let countdownElement = document.getElementById('countdown');

  if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
    days = 0;
    minutes = 0;
    hours = 0;
    seconds = 0;
    const sectionTitle = document.querySelector("#countdown-title");
    sectionTitle.innerText = "Workshop Registrations Ended!";
    countdownElement.innerHTML = `<div class="countdown-item">
    <span class="countdown-number">${days}</span>
    <span class="countdown-label">Days</span>
  </div>
  <div class="countdown-item">
    <span class="countdown-number">${hours}</span>
    <span class="countdown-label">Hours</span>
  </div>
  <div class="countdown-item">
    <span class="countdown-number">${minutes}</span>
    <span class="countdown-label">Minutes</span>
  </div>
  <div class="countdown-item">
    <span class="countdown-number">${seconds}</span>
    <span class="countdown-label">Seconds</span>
  </div>`;

  }

  countdownElement.innerHTML = `
    <div class="countdown-item">
      <span class="countdown-number">${days}</span>
      <span class="countdown-label">Days</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-number">${hours}</span>
      <span class="countdown-label">Hours</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-number">${minutes}</span>
      <span class="countdown-label">Minutes</span>
    </div>
    <div class="countdown-item">
      <span class="countdown-number">${seconds}</span>
      <span class="countdown-label">Seconds</span>
    </div>
  `;
}

export default updateCountdown;