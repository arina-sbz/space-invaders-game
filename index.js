import { Game } from './Model/Game.js';
import { GameView } from './view.js';
import { GameController } from './controller.js';

window.addEventListener('load', function () {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');
	canvas.width = 600;
	canvas.height = 700;

	const game = new Game(canvas);

	const view = new GameView(game, ctx);
	const controller = new GameController(game, view);

	let lastTime = 0;
	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		controller.updateGame(deltaTime);
		controller.renderGame();
		window.requestAnimationFrame(animate);
	}
	animate(0);
});
