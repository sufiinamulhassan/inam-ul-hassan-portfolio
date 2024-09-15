const header = document.querySelector("header");

const firstSkill = document.querySelector(".skill:first-child");
const skCounters = document.querySelectorAll(".counter span");
const progressBars = document.querySelectorAll(".skills svg circle");

const mlSection = document.querySelector(".milestones");
const ml_Counter = document.querySelectorAll(".number span");

const zoom_icons = document.querySelectorAll(".zoom-icons");
const modal_overlay = document.querySelector('.modal-overlay');
const images = document.querySelectorAll(".images img");
const prev_btn = document.querySelector(".prev-btn");
const next_btn = document.querySelector(".next-btn");
const slider_wrap = document.querySelector('.slider-wrap');
const modal = document.querySelector('.modal');

const links = document.querySelectorAll(".nav-link");

const toggle_btn = document.querySelector(".toggle-btn");

const hamburger = document.querySelector(".hamburger");


window.addEventListener("scroll", () => {
    activeLink();
    if (!skillsPlayed) {
        skillsCounter();
        ml_Counter();
    }
});

/* --------------- Sticky Navbar --------------- */
function stickyNavBar() {
    header.classList.toggle("scrolled", window.scrollY > 0);
}
stickyNavBar();
window.addEventListener("scroll", stickyNavBar);



/* --------------- Reveal Animation --------------- */
let sr = ScrollReveal({
    duration: 2500,
    distance: "60px",
});
sr.reveal(".showcase-info", { delay: 600 });
sr.reveal(".showcase-image", { origin: "top", delay: 700 });



/* --------------- Skills Progress Bar Animation --------------- */
let skillsPlayed = false;

function hasReached(el) {
    let topPosition = el.getBoundingClientRect().top;
    return window.innerHeight >= topPosition + el.offsetHeight;
}

function updateCount(num, maxNum) {
    let currentNum = parseInt(num.innerText, 10);
    if (currentNum < maxNum) {
        num.innerText = (currentNum + 1) + '%';
        setTimeout(() => {
            updateCount(num, maxNum);
        }, 12);
    } else {
        num.innerText = maxNum + '%';
    }
}

function resetSkills() {
    skCounters.forEach((counter, i) => {
        counter.innerText = '0%'; // Reset counter text
        progressBars[i].style.strokeDashoffset = '426'; // Reset progress bar
        progressBars[i].style.animation = ''; // Remove animation
    });
}

function skillsCounter() {
    if (hasReached(firstSkill)) {
        if (!skillsPlayed) {
            skillsPlayed = true;
            skCounters.forEach((counter, i) => {
                let target = +counter.dataset.target;
                let strokeValue = 426 - (426 * (target / 100));

                // Set the stroke-dashoffset to the target value
                progressBars[i].style.strokeDashoffset = strokeValue;
                progressBars[i].style.animation = "progress 2s ease-in-out forwards";
                progressBars[i].style.setProperty('--target', strokeValue);

                setTimeout(() => {
                    updateCount(counter, target);
                }, 400);
            });
        }
    } else {
        if (skillsPlayed) {
            skillsPlayed = false;
            resetSkills();
        }
    }
}

/* --------------- Service Counter Animation --------------- */
let serviceCountersPlayed = false;

function serviceCounter() {
    if (hasReached(mlSection)) {
        if (!serviceCountersPlayed) {
            serviceCountersPlayed = true;
            ml_Counter.forEach((counter) => {
                let target = +counter.dataset.target;
                let count = 0;
                let interval = setInterval(() => {
                    if (count < target) {
                        count++;
                        counter.innerText = count;
                    } else {
                        clearInterval(interval);
                        counter.innerText = target;
                    }
                }, 50); // Adjust the speed of the counting animation
            });
        }
    } else {
        if (serviceCountersPlayed) {
            serviceCountersPlayed = false;
            ml_Counter.forEach((counter) => {
                counter.innerText = '0'; // Reset counter text
            });
        }
    }
}

// Add both counters to the scroll event listener
window.addEventListener("scroll", () => {
    skillsCounter();
    serviceCounter();
});




/* --------------- Portfolio Filter Animation --------------- */

let mixer = mixitup(".portfolio-gallery", {
    selectors: {
        target: ".prt-card",
    },
    animation: {
        duration: 500,
    }
});


/* --------------- Modal Pop Up Animation --------------- */

let currentIndex = 0;

// Function to handle image change
function changeImage(index) {
    images.forEach((img) => img.classList.remove("showImage"));
    images[index].classList.add("showImage");
}

// Function to open the modal
function openModal(index) {
    currentIndex = index;
    changeImage(currentIndex);
    modal.classList.add('open');
    slider_wrap.style.transform = 'translate(-50%, -50%)';
    slider_wrap.style.opacity = '1';
    modal_overlay.style.opacity = '1';
    modal.style.pointerEvents = 'auto';
    document.body.classList.add("stopScrolling");
}

// Function to close the modal
function closeModal() {
    modal.classList.remove('open');
    slider_wrap.style.transform = 'translate(-50%, calc(-50% + 400px))';
    slider_wrap.style.opacity = '0';
    modal_overlay.style.opacity = '0';
    modal.style.pointerEvents = 'none';
    document.body.classList.remove("stopScrolling");
}

// Event listeners for opening the modal
zoom_icons.forEach((icon, i) => {
    icon.addEventListener("click", () => {
        openModal(i);
    });
});

// Event listener for closing the modal
modal_overlay.addEventListener("click", closeModal);

// Event listeners for next and previous buttons
next_btn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    changeImage(currentIndex);
});

prev_btn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage(currentIndex);
});



/* --------------- Swiper slide Reviews Animation --------------- */

const swiper = new Swiper('.swiper', {
    loop: true,
    speed: 500,
    autoplay: true,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});



/* --------------- Change active links --------------- */

function activeLink() {
    let sections = document.querySelectorAll("section[id]");
    let passedSections = Array.from(sections)
        .map((sct) => {
            return {
                y: sct.getBoundingClientRect().top - header.offsetHeight,
                id: sct.getAttribute("id")
            };
        })
        .filter((sct) => sct.y <= 0);

    let currSectionID = passedSections.at(-1)?.id;

    links.forEach(link => link.classList.remove("active"));
    if (currSectionID) {
        document.querySelector(`.nav-link[href="#${currSectionID}"]`).classList.add("active");
    }
}


/* --------------- Change Page Theme --------------- */

let firstTheme = Number(localStorage.getItem("dark"));
changeTheme(firstTheme);

function changeTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark");
        toggle_btn.classList.replace("uil-moon", "uil-sun");
        localStorage.setItem("dark", 1);
    } else {
        document.body.classList.remove("dark");
        toggle_btn.classList.replace("uil-sun", "uil-moon");
        localStorage.setItem("dark", 0);
    }
}

toggle_btn.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");
    changeTheme(isDark);
});


/* --------------- Open & Close Navbar Mode --------------- */

hamburger.addEventListener("click", () => {
    document.body.classList.toggle("open");
    document.body.classList.toggle("stopScrolling");
});

links.forEach(link =>
    link.addEventListener("click", () => {
        document.body.classList.remove("open");
        document.body.classList.remove("stopScrolling");
    })
);