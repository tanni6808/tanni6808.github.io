'use strict';

/*
console.log(document.querySelector('.message').textContent);

document.querySelector('.message').textContent = `I'm changed!`;

document.querySelector('.number').textContent = 13;
document.querySelector('.score').textContent = 10;

document.querySelector('.guess').value = 12;
*/

let secretNumber = Math.trunc(Math.random() * 20) + 1;
console.log(secretNumber);

let score = 20; //NOTE state of application
let highscore = 0; //NOTE state of application

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  console.log(secretNumber);

  displayMessage(`Start guessing...`);
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.color = '#222';
  document.querySelector('.number').style.width = '15rem';
});

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);

  //when there's no input
  if (!guess) {
    displayMessage(`No number!`);

    //when it's not bewteen 1 and 20
  } else if (guess < 0 || guess > 20) {
    displayMessage(`Between 1 and 20!`);

    //when player wins
  } else if (guess === secretNumber) {
    displayMessage(`Congraduration!`);

    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').textContent = secretNumber;
    document.querySelector('.number').style.color = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }

    //when guess is wrong
  } else if (guess !== secretNumber) {
    if (score > 1) {
      //NOTE turnery operator!
      displayMessage(guess > secretNumber ? `Lower!` : `Higher!`);
      score--;
      document.querySelector('.score').textContent = score;
    } else {
      document.querySelector('.score').textContent = 0;
      displayMessage(`YOU LOSE💀!`);
    }
  }
});
