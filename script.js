const startScreenElement = document.getElementById("start-screen");
const gameScreenElement = document.getElementById("game-screen");
const gameOverScreenElement = document.getElementById("game-over-screen");

const startButton = startScreenElement.querySelector("button");
const playAgainButton = gameOverScreenElement.querySelector("button");
const restartButton = gameScreenElement.querySelector("button");

const game = new Game(gameScreenElement, gameOverScreenElement, restartButton);

startButton.addEventListener("click", () => {
  game.start();

  startScreenElement.style.display = "none";
  restartButton.style.display = "none";
  gameScreenElement.style.display = "";
});

playAgainButton.addEventListener("click", () => {
  game.start();

  gameOverScreenElement.style.display = "none";
  restartButton.style.display = "none";
  gameScreenElement.style.display = "";
});

restartButton.addEventListener("click", () => {
  game.start();

  gameOverScreenElement.style.display = "none";
  restartButton.style.display = "none";
  gameScreenElement.style.display = "";
});

/*
const startScreenElement = document.getElementById('start-screen');
const playingScreenElement = document.getElementById('playing-screen');
const endScreenElement = document.getElementById('game-over-screen');

const startButton = startScreenElement.querySelector('button');
const tryAgainButton = endScreenElement.querySelector('button');

const screenElements = {
start: startScreenElement,
playing: playingScreenElement,
end: endScreenElement
};

const game = new Game(canvasElement, screenElements);

startButton.addEventListener('click', () => {
game.start();
});

tryAgainButton.addEventListener('click', () => {
game.start();
});
*/
