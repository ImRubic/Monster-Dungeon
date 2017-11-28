import Game from './game.js';
import './index.css';

var message = document.createElement('div');
message.id = "message";
document.body.appendChild(message);

var canvas = document.createElement('canvas');
canvas.width = 352;
canvas.height = 352;
var context = canvas.getContext('2d');
document.body.appendChild(canvas);

var message2 = document.createElement('div');
message2.id = "message2";
document.body.appendChild(message2);

var game = new Game(canvas.width, canvas.height, context);

// After 3 seconds (to allow image load time), render
