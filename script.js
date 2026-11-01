'use strict';

// Elements
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const learnMoreBtn = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const operationTabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const operationsContent = document.querySelectorAll('.operations__content');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const blurredImgs = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const slideBtnLeft = document.querySelector('.slider__btn--left');
const slideBtnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');
const scrollTop = document.querySelector('.scroll-to-top');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// PROJECT WORK
// Learn more button
learnMoreBtn.addEventListener('click', function () {
  // Note: getBoundingClientRect() is a method that is used to get the measurements of a specific element on the webpage (vertically/horizontally)
  // const s1Coords = section1.getBoundingClientRect();

  // Implementing the Smooth Scroll
  // Old School way:
  //   window.scrollTo({
  //     left: s1Coords.left + window.scrollX,
  //     top: s1Coords.top + window.scrollY,
  //     behavior: 'smooth',
  //   });

  // Modernally:
  section1.scrollIntoView({ behavior: 'smooth' });
});

// PAGE NAVIGATION
// document.querySelectorAll('.nav__link').forEach(function (nav) {
//   nav.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Using Event Delegation
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();

  // Note: the following condition is used to ignore any targeted events other than the nav links.
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// OPERATION SECTION
tabContainer.addEventListener('click', e => {
  const clickedTab = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clickedTab) return;

  // Remove active tabs and content
  operationTabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  operationsContent.forEach(tab =>
    tab.classList.remove('operations__content--active'),
  );

  // Activate tab
  clickedTab.classList.add('operations__tab--active');

  // Activate content area
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

// MENU FADE ANIMATION

// Main Function
function handleHover(e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblingLinks = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblingLinks.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
}

//Fade In
nav.addEventListener('mouseover', handleHover.bind(0.5));

//Fade Out
nav.addEventListener('mouseout', handleHover.bind(1));

// NAVIGATION BAR STICKY SCROLL
// window.addEventListener('scroll', function () {
//   const sec1Coords = section1.getBoundingClientRect();

//   if (window.scrollY > sec1Coords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky Navigation Using: Intersection Observer API.
// Observer Callback Function "StickyNav"
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});
headerObserver.observe(header);

// STICKY SCROLL TO TOP BUTTON
const stickyBtn = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting || nav.classList.contains('sticky')) {
    scrollTop.classList.add('scroll-fade');
  } else {
    scrollTop.classList.remove('scroll-fade');
  }
};

scrollTop.addEventListener('click', () =>
  header.scrollIntoView({ behavior: 'smooth' }),
);

const navObserver = new IntersectionObserver(stickyBtn, {
  root: null,
  threshold: 0,
});
navObserver.observe(nav);

// SECTIONS REVEALATION
const revealSection = function (entries, observer) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');

    // To Stop Observing after all section became visible:
    observer.unobserve(entry.target);
  });
};

const sectionObserever = new IntersectionObserver(revealSection, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0.15,
});
allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserever.observe(section);
});

// LAZY LOADING IMAGES
const loadImg = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    // Replace the src attribute
    entry.target.src = entry.target.dataset.src;

    // This event listener is used to implement the previous changes once the "entry.target" is finished with loading
    entry.target.addEventListener('load', function () {
      entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-150px',
});

blurredImgs.forEach(img => imgObserver.observe(img));

// IMPLEMENTING THE SLIDER
let currentSlide = 0;
const maxSlide = slides.length - 1;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class= "dots__dot" data-slide= "${i}"></button>`,
    );
  });
};
createDots();

const transformSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

transformSlide(0);

const activateDot = function (slide) {
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));
  dots[slide].classList.add('dots__dot--active');
};

const setInitials = function (slide) {
  transformSlide(slide);
  activateDot(slide);
};

const nextSlide = function () {
  if (currentSlide === maxSlide) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  setInitials(currentSlide);
};

const prevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide;
  } else {
    currentSlide--;
  }

  setInitials(currentSlide);
};

slideBtnRight.addEventListener('click', nextSlide);
slideBtnLeft.addEventListener('click', prevSlide);

// Arrow Left and Arrow Right
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
  console.log(e.key);
});

// Dots Control
const dots = document.querySelectorAll('.dots__dot');

dots[0].classList.add('dots__dot--active');

dotContainer.addEventListener('click', function (e) {
  const clickedDot = e.target.closest('.dots__dot');
  if (!clickedDot) return;

  currentSlide = Number(clickedDot.dataset.slide);

  // Active Slide
  setInitials(currentSlide);
});
////////////////////////////////////////////
// Practice >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
////////////////////////////////////////////
// INTERSECTION OBSERVER
// Observer Callback Function
// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// // Observer Options
// const obsOptions = {
//   root: null,
//   threshold: 0.2,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
