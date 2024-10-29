"use strict";

//TODO selecting the element of scores of player 1(0) & 2(1)
const score0El = document.querySelector("#score--0");
const score1El = document.getElementById("score--1");
const currentScore0El = document.querySelector("#current--0");
const currentScore1El = document.querySelector("#current--1");

const diceEl = document.querySelector(".dice");

const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");

let scores, currentScore, activePlayer, playing;

// let scores = [0, 0]; //save the total scores of both players
// let currentScore = 0;
// let activePlayer = 0;

const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;

  document
    .querySelector(`.player--${activePlayer}`)
    .classList.remove("player--active");
  activePlayer = activePlayer === 0 ? 1 : 0;
  document
    .querySelector(`.player--${activePlayer}`)
    .classList.add("player--active");
  //NOTE toggle method can do this, too.
  // player0El.classList.toggle('player--active');
  // player1El.classList.toggle('player--active');
};

const init = function () {
  playing = 1;
  scores = [0, 0];
  currentScore = 0;
  activePlayer = 0;

  score0El.textContent = 0;
  score1El.textContent = 0;
  currentScore0El.textContent = 0;
  currentScore1El.textContent = 0;

  diceEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");
};

//STATE initial
init();

diceEl.classList.add("hidden");

//ACTION rolling dice
//functionality
btnRoll.addEventListener("click", function () {
  if (playing) {
    //TODO generating a random dice
    const dice = Math.trunc(Math.random() * 6) + 1;
    console.log(dice);
    //TODO display dice
    diceEl.classList.remove("hidden");
    diceEl.src = `dice-${dice}.png`;
    //TODO Check for rolled 1
    if (dice !== 1) {
      currentScore += dice;
      //TODO add dice to current score
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      //TODO reset current score and switch to next player
      switchPlayer();
    }
  }
});

//ACTION hold score
btnHold.addEventListener("click", function () {
  if (playing) {
    //TODO add current score to active player's score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    //TODO check score > 50 ?
    if (scores[activePlayer] >= 50) {
      //finish the game
      playing = 0;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove("player--active");
      document.getElementById(`current--${activePlayer}`).textContent = 0;
      document.getElementById(`score--${activePlayer}`).textContent += "\nWin!";
      diceEl.classList.add("hidden");
    } else {
      //:reset current score and switch to next player
      switchPlayer();
    }
  }
});

//ACTION new game
btnNew.addEventListener("click", init);
