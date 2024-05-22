/**
 * PRELOAD
 * 
 * loading will be end after document is loaded
 */

const preloader = document.querySelector("[data-preaload]");

window.addEventListener("load", function () {
  preloader.classList.add("loaded");
  document.body.classList.add("loaded");
});


//account options;
function accountClickToggler(accountClickCount, accountDiv) {
  // console.log("i am called");
  if (accountClickCount % 2 == 0) accountDiv.style.display = "none";
  else accountDiv.style.display = "block";
}

let profilepicture = document.querySelector("#profilepicture");
let accountDiv = document.querySelector("#account-options");

let accountClickCount = 0;
if (accountDiv) {
  accountClickToggler(accountClickCount, accountDiv);
}
if (accountDiv) {
  profilepicture.addEventListener("click", (event) => {
    event.stopPropagation();
    accountClickCount++;
    accountClickToggler(accountClickCount, accountDiv)
  });
}
const body = document.querySelector("body");

body.addEventListener("click", () => {
  if (accountClickCount % 2 == 1) {
    accountClickCount++;
    accountClickToggler(accountClickCount, accountDiv)
  }
})





/**
 * add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
}



/**
 * NAVBAR
 */

const navbar = document.querySelector("[data-navbar]");
// console.log(navbar);
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = () => {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
  document.body.classList.toggle("nav-active");
}

addEventOnElements(navTogglers, "click", toggleNavbar);


let navLinks = document.querySelectorAll(".navbar-list a");
// console.log(navLinks);

function resizeFn() {
  if (window.innerWidth < 1200) {
    for (let ele of navLinks) {
      ele.addEventListener("click", () => {
        console.log("got clicked");
        toggleNavbar();
      })
    }
  }
}
window.onresize = resizeFn;
resizeFn();


/**
 * HEADER & BACK TOP BTN
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

let lastScrollPos = 0;

const hideHeader = function () {
  const isScrollBottom = lastScrollPos < window.scrollY;
  if (isScrollBottom) {
    header.classList.add("hide");
  } else {
    header.classList.remove("hide");
  }

  lastScrollPos = window.scrollY;
}

window.addEventListener("scroll", function () {
  if (window.scrollY >= 50) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
    hideHeader();
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});



/**
 * HERO SLIDER
 */

const heroSlider = document.querySelector("[data-hero-slider]");
const heroSliderItems = document.querySelectorAll("[data-hero-slider-item]");
const heroSliderPrevBtn = document.querySelector("[data-prev-btn]");
const heroSliderNextBtn = document.querySelector("[data-next-btn]");

let currentSlidePos = 0;
let lastActiveSliderItem = heroSliderItems[heroSliderItems.length - 1];

const updateSliderPos = function () {
  lastActiveSliderItem.classList.remove("active");
  heroSliderItems[currentSlidePos].classList.add("active");
  lastActiveSliderItem = heroSliderItems[currentSlidePos];
}

const slideNext = function () {
  if (currentSlidePos >= heroSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  updateSliderPos();
}

heroSliderNextBtn.addEventListener("click", slideNext);

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = heroSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }

  updateSliderPos();
}

heroSliderPrevBtn.addEventListener("click", slidePrev);

/**
 * auto slide
 */

let autoSlideInterval;

const autoSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 7000);
}

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([heroSliderNextBtn, heroSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);



var swiper = new Swiper(".special_swiper", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 2000,
  },
});


//menu swipper
var swiper = new Swiper(".menu_swipper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  speed: 1000,
  autoplay: {
    delay: 2000,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    dynamicBullets: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    640: {
      slidesPerView: 2,
    },
    768: {
      slidesPerView: 3,
      // spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      // spaceBetween: 50,
    },
  },
});

let menuBtn = document.querySelectorAll(".btn-view-menu");
// console.log(menuBtn);
let menuContainer = document.querySelector("#popup-section");
let closebtn = document.querySelectorAll(".cross");
let head = document.querySelector("header");
let itemNum;

for (let btn of menuBtn) {

  btn.addEventListener("click", () => {
    // console.log("clicked");
    itemNum = btn.getAttribute("id").slice(-1);
    document.body.classList.add("popup");
    menuContainer.classList.add("show-item" + itemNum);
    head.style.visibility = "hidden";
  });
}

for (let btn of closebtn) {
  btn.addEventListener("click", () => {
    // console.log(btn);
    document.body.classList.remove("popup");
    menuContainer.classList.remove("show-item" + itemNum);
    head.style.visibility = "visible";
  });
}

/**
 * TESTIMONIAL SLIDER
 */

const testiSlider = document.querySelector("[data-testi-slider]");
const testiSliderItems = document.querySelectorAll("[data-testi-slider-item]");
const testiSliderPrevBtn = document.querySelector("[testi-data-prev-btn]");
const testiSliderNextBtn = document.querySelector("[testi-data-next-btn]");

let currentTestiSlidePos = 0;
let lastActiveTestiSliderItem = testiSliderItems[testiSliderItems.length - 1];
console.dir(lastActiveTestiSliderItem);

const updateTestiSliderPos = function () {
  lastActiveTestiSliderItem.classList.remove("active");
  testiSliderItems[currentTestiSlidePos].classList.add("active");
  lastActiveTestiSliderItem = testiSliderItems[currentTestiSlidePos];
}

const slideTestiNext = function () {
  if (currentTestiSlidePos >= testiSliderItems.length - 1) {
    currentTestiSlidePos = 0;
  } else {
    currentTestiSlidePos++;
  }

  updateTestiSliderPos();
}

testiSliderNextBtn.addEventListener("click", slideTestiNext);

const slideTestiPrev = function () {
  if (currentTestiSlidePos <= 0) {
    currentTestiSlidePos = testiSliderItems.length - 1;
  } else {
    currentTestiSlidePos--;
  }

  updateTestiSliderPos();
}

testiSliderPrevBtn.addEventListener("click", slideTestiPrev);

let autoTestiSlideInterval;

const testiautoSlide = function () {
  autoTestiSlideInterval = setInterval(function () {
    slideTestiNext();
  }, 3000);
}

addEventOnElements([testiSliderNextBtn, testiSliderPrevBtn], "mouseover", function () {
  clearInterval(autoTestiSlideInterval);
});

addEventOnElements([testiSliderNextBtn, testiSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", testiautoSlide);

/**
 * PARALLAX EFFECT
 */

const parallaxItems = document.querySelectorAll("[data-parallax-item]");

let x, y;

window.addEventListener("mousemove", function (event) {

  x = (event.clientX / window.innerWidth * 10) - 5;
  y = (event.clientY / window.innerHeight * 10) - 5;

  // reverse the number eg. 20 -> -20, -5 -> 5
  x = x - (x * 2);
  y = y - (y * 2);

  for (let i = 0, len = parallaxItems.length; i < len; i++) {
    x = x * Number(parallaxItems[i].dataset.parallaxSpeed);
    y = y * Number(parallaxItems[i].dataset.parallaxSpeed);
    parallaxItems[i].style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  }

});

/**
 * COUNTDOWN TIMER
 */

// Set the date and time of the coffee workshop
let time = document.querySelector(".gettime").textContent;
console.log(time);
const workshopDate = new Date(time); // Replace with the actual date and time
let start = true;

// Function to update the countdown timer
function updateCountdown() {
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

    clearInterval(countdownTimer);
    return;
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

// Update the countdown every second
let countdownTimer = setInterval(updateCountdown, 1000);


// Form submission logic
// const signupForm = document.getElementById('signupForm');
// signupForm.addEventListener('submit', function (event) {
//   // event.preventDefault();
//   // Handle form submission, e.g., send data to server
//   // You can add your own logic here
//   alert('Sign up successful!');
// });


const signupForm = document.getElementById('signupForm');

signupForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const submitter = document.querySelectorAll("button[value=save]");
  // Get form data
  // var formData = new FormData(this);
  let userMessage = document.querySelector("#message");
  let userPhone = document.querySelector("#phonenumber");
  // console.log(userMessage.value);
  // console.log(userPhone.value);
  userPhone = userPhone.value.trim();

  if (userPhone.length == 10 && parseInt(userPhone).toString().length == 10) {

    let postRoute = signupForm.getAttribute("action");
    let formData = { userMessage: userMessage.value, userPhone: userPhone };
    console.log(formData, postRoute);


    // Send data to server
    fetch(postRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        console.log(data); // Log server response
        data = JSON.parse(data);
        let { name, status } = data;
        console.log(name, status);
        window.alert(name + " " + status);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    window.alert("Please Enter a Valid Phone Number");
  }
});

// script.js



document.addEventListener("DOMContentLoaded", function () {
  // Get references to the select elements
  var coffeeSelector = document.getElementById("coffeeSelector");
  var cheeseSelector = document.getElementById("cheeseSelector");

  // Get references to the img elements
  var coffeeImage = document.getElementById("coffeeImage");
  var cheeseImage = document.getElementById("cheeseImage");

  // Add event listener to both selectors
  coffeeSelector.addEventListener("change", updatePairing);
  cheeseSelector.addEventListener("change", updatePairing);


  const pairings = {
    mediumRoast: {
      brie: 'Try pairing Medium Roast coffee with creamy Brie for a delightful balance of flavors.',
      gouda: 'Medium Roast coffee complements the nutty flavor of Gouda cheese.',
      blue: 'The boldness of Blue Cheese is enhanced by the subtle notes of Medium Roast coffee.'
    },
    darkRoast: {
      brie: 'Dark Roast coffee and Brie create a rich and robust combination.',
      gouda: 'Pair Dark Roast coffee with Gouda for a strong and savory pairing.',
      blue: 'The intense flavors of Dark Roast coffee complement the boldness of Blue Cheese.'
    },
    flavoredCoffee: {
      brie: 'The sweetness of flavored coffee goes well with the creaminess of Brie.',
      gouda: 'Enhance the unique flavors of flavored coffee with Gouda cheese.',
      blue: 'Pair your flavored coffee with the strong taste of Blue Cheese for a bold experience.'
    }
  };

  // Initial pairing update
  updatePairing();


  // Function to update pairing based on selected options
  function updatePairing() {
    // Get the selected coffee and cheese
    var selectedCoffee = coffeeSelector.value;
    var selectedCheese = cheeseSelector.value;

    // Update the images
    coffeeImage.src = "./assets/images/" + selectedCoffee + ".jpg";
    cheeseImage.src = "./assets/images/" + selectedCheese + ".jpg";

    // Display the pairing result
    var pairingResult = document.getElementById("pairingResult");
    if (pairings[selectedCoffee] && pairings[selectedCoffee][selectedCheese]) {
      pairingResult.textContent = pairings[selectedCoffee][selectedCheese];
    } else {
      pairingResult.textContent = 'Please select a valid coffee and cheese combination.';
    }
  }
});


// Special Dish Slider

const specialDishSlider = document.querySelector("[data-special-dish-slider]");
const specialDishSliderItems = document.querySelectorAll("[data-special-dish-slider-item]");
const specialDishSliderPrevBtn = document.querySelector("[data-hero-prev-btn]");
const specialDishSliderNextBtn = document.querySelector("[data-hero-next-btn]");

currentSlidePos = 0;
let lastActiveSpecialSliderItem = specialDishSliderItems[0];

// console.log(specialDishSliderItems[0].innerHTML);
// console.log(specialDishSliderNextBtn.innerHTML);

const updateSpecialDishSliderPos = function () {
  lastActiveSpecialSliderItem.classList.remove("active");
  specialDishSliderItems[currentSlidePos].classList.add("active");
  lastActiveSpecialSliderItem = specialDishSliderItems[currentSlidePos];
}

const slideSpecialDishNext = function () {
  // console.log("Before changing, Slide no :", currentSlidePos);
  if (currentSlidePos >= specialDishSliderItems.length - 1) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }
  // console.log(lastActiveSliderItem.innerHTML);
  updateSpecialDishSliderPos();
  console.log("After Changing, Current Slide no :", currentSlidePos);
}

specialDishSliderNextBtn.addEventListener("click", slideSpecialDishNext);

const slideSpecialDishPrev = function () {
  // console.log("Before changing, Slide no :", currentSlidePos);
  if (currentSlidePos <= 0) {
    currentSlidePos = specialDishSliderItems.length - 1;
  } else {
    currentSlidePos--;
  }
  // console.log(lastActiveSliderItem.innerHTML);
  updateSpecialDishSliderPos();
  console.log("After Changing, Current Slide no :", currentSlidePos);
}

specialDishSliderPrevBtn.addEventListener("click", slideSpecialDishPrev);



const autoSpecialSlide = function () {
  autoSlideInterval = setInterval(function () {
    slideNext();
  }, 10000);
}

addEventOnElements([specialDishSliderNextBtn, specialDishSliderPrevBtn], "mouseover", function () {
  clearInterval(autoSlideInterval);
});

addEventOnElements([specialDishSliderNextBtn, specialDishSliderPrevBtn], "mouseout", autoSlide);

window.addEventListener("load", autoSlide);


//about

var currentIndex = 0;
var bannerImages = document.getElementsByClassName("banner-image");

function showNextImage() {
  // Hide the current image
  bannerImages[currentIndex].style.display = "none";

  // Increment the index or reset to 0 if it exceeds the number of images
  currentIndex = (currentIndex + 1) % bannerImages.length;

  // Display the next image
  bannerImages[currentIndex].style.display = "block";

  // Set a timeout for the next image
  setTimeout(showNextImage, 5000); // Adjust the time interval (in milliseconds) as needed
}

// Start the slideshow
showNextImage();
