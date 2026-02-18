import Game from './Game.js';

const canvas = document.getElementById('canvas');
const game = new Game(canvas);

game.init().then(() => {
  game.start();
});
