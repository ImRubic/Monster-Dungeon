import Game from './game.js';
import './index.css';

var canvas = document.createElement('canvas');
canvas.width = 352;
canvas.height = 352;
var context = canvas.getContext('2d');
document.body.appendChild(canvas);


var game = new Game(canvas.width, canvas.height, context);

// After 3 seconds (to allow image load time), render
