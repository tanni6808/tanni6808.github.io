'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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

// Smooth Scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// }); // this is inefficient

// SEC Event Delegation
// 1. add event listener to commen parent element--so this one event listener can catch any event from its children
// 2. determine what element originated the event--the event.target will tell us in which child the event was triggered
// 3. work with the element that the event were created

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy: prevent clicking out of btns works
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  )
    document
      .querySelector(e.target.getAttribute('href'))
      .scrollIntoView({ behavior: 'smooth' });
});

// Tab Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// tabs.forEach(tab => tab.addEventListener('click', () => console.log('tab')));

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  //if (e.target.classList.contains('operations__tab')) console.log(e.target); // this won't work if we click the number span element
  const clicked = e.target.closest('.operations__tab');
  // matching strategy: Guard clause
  if (!clicked) return;
  //activate tabs
  tabsContainer
    .querySelector('.operations__tab--active')
    .classList.remove('operations__tab--active');
  clicked.classList.add('operations__tab--active');
  //activate contents
  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu Fade Animations
const handleHover = function (e) {
  //console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const hovered = e.target;
    const siblings = hovered.closest('.nav').querySelectorAll('.nav__link');
    const logo = hovered.closest('.nav').querySelector('img');
    //console.log(hovered, siblings, logo);

    siblings.forEach(element => {
      if (element !== hovered) element.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const nav = document.querySelector('.nav');
// nav.addEventListener('mouseover', function (e) {
//   //mouseenter do not bubble
//   handleHover(e, 0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });
nav.addEventListener('mouseover', handleHover.bind(0.5)); //change this keyword to 0.5

nav.addEventListener('mouseout', handleHover.bind(1)); //change this keyword to 1

// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect().y;
// //console.log(initialCoords);
// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > initialCoords) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
//// use The Intersection Observer API
// h

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
//console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`, //90px before reaching the threshold
});
headerObserver.observe(header);

// Revealing Elements on Scroll
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries; //because we have only one threshold so we will have only one entry in the entries array
  //console.log(entry, observer);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]'); //select the img element that has the property of data-src

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    //remove the blur after big image finished loading
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.1,
  rootMargin: '-200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider Components
const slider = function () {
  //
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length - 1;

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.5)';
  // slider.style.overflow = 'visible';

  // Functions
  // TODO: make slides side by side
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // TODO: create dots below the slides
  const creatDots = function () {
    slides.forEach(function (slide, index) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  // TODO: change dot color of current slide
  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // TODO: slide btn
  const nextSlide = function () {
    if (currentSlide === maxSlide) currentSlide = 0;
    else currentSlide++;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  const prevSlide = function () {
    if (currentSlide === 0) currentSlide = maxSlide;
    else currentSlide--;
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const init = function () {
    goToSlide(0);
    creatDots();
    activateDot(currentSlide);
  };
  init(); //initialization

  // Event Listener
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    //console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    else if (e.key === 'ArrowRight') nextSlide();
  });

  // TODO: dot functionality
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////
///////////////////////////////////////
/*
//SEC basic manupulations
// SELECT ELEMENTS
//select the entire document of the webpage
console.log(document.documentElement);
//select the head and body
console.log(document.head);
console.log(document.body);

//get nodelist
const allSections = document.querySelectorAll('.section');
console.log(allSections);

//get HTMLCollection (life, update automatically)
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
console.log(document.getElementsByClassName('btn'));

// CREATE and INSERT ELEMENTS
const message = document.createElement('div'); //->DOM object
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analysitics. <button class="btn btn--close-cookie">Got It!</button>';
const header = document.querySelector('.header');

header.prepend(message);
header.append(message);
// even I write them there twice, it will only appear in the page once
// this is because the message is now a life element living in the DOM
// it can't be in multiple places in the same time
// this manipulation is like moving it
// if we really want two of them, we need to clone it first
//header.prepend(message.cloneNode(true));
// we also have before(), after() that can insert elements

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });
///////////////////////////////////////

//SEC styles, attributes and classes
// STYLES
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//get styles by style: only work for inline styles (insert by ourselves)
console.log(message.style.color);
console.log(message.style.backgroundColor);
//by getComputedStyle: get every thing, include which we didn't defined
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//document.documentElement.style.setProperty('--color-primary', 'pink');

// ATTRIBUTES
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);
// won't work if the attribute is not default
console.log(logo.designer);
// to find not default attributes:
console.log(logo.getAttribute('designer'));
// and their results might be different (src, href)
console.log(logo.src); //absolute
console.log(logo.getAttribute('src')); //relative

//set attributes
logo.alt = 'Beautiful Minimalist Logo :)';
logo.setAttribute('company', 'Bankist');

//data attribute: attributes start with 'data-' always saved in dataset object
console.log(logo.dataset.versionNumber);

// CLASS
// logo.classList.add();
// logo.classList.remove();
// logo.classList.toggle();
// logo.classList.contains();
///////////////////////////////////////

//SEC smooth scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

// get section information (coordinates)
btnScrollTo.addEventListener('click', function (e) {
  //coords of section1
  const s1Coords = section1.getBoundingClientRect();
  console.log(s1Coords);
  //coords of current btn
  console.log(e.target.getBoundingClientRect());

  // get current viewport information
  console.log('current scroll (x/y)', scrollX, scrollY);
  console.log(
    'viewport height/width',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // scrolling
  //oldway:
  //window.scrollTo(s1Coords.left + scrollX, s1Coords.top + scrollY);
  // window.scrollTo({
  //   left: s1Coords.left + scrollX,
  //   top: s1Coords.top + scrollY,
  //   behavior: 'smooth',
  // });
  //modern way:
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////

//SEC events
const h1 = document.querySelector('h1');

// oldschool way
// h1.onmouseenter = function (e) {
//   alert('addEventListener: Great! U are reading the heading :))');
// };
// morden way
const alterH1 = function (e) {
  alert('addEventListener: Great! U are reading the heading :))');
  // remove event listener
  h1.removeEventListener('mouseenter', alterH1);
};

h1.addEventListener('mouseenter', alterH1);
///////////////////////////////////////

//SEC event propagation (mainly bubbling)

// rgb(255, 255, 255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('Features', e.target);

  //e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINKS', e.target);
});
document.querySelector('.nav').addEventListener(
  'click',
  function (e) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', e.target);
  },
  true
);
///////////////////////////////////////

//SEC DOM traversing

const h1 = document.querySelector('h1');

//going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'pink';

//going upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)'; //itself

//going sideways: siblings
console.log(h1.previousElementSibling); //nothing->null
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});
///////////////////////////////////////

//SEC Lifecycle DOM Events

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM trss built!', e); //load HTML & JavaScript
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   //e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
///////////////////////////////////////
*/
