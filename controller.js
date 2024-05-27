export class GameController {
	constructor(game, view) {
		this.game = game;
		this.view = view;

		this.initializeEventListeners();
	}

	initializeEventListeners() {
		window.addEventListener('keydown', (event) => this.handleKeydown(event));
		window.addEventListener('keyup', (event) => this.handleKeyup(event));
	}

	handleKeydown(event) {
		const projectileKeys = ['1', 'w']; // Array to store projectile keys
	
		if (projectileKeys.includes(event.key) && !this.game.fired && this.game.player.energy > 0) {
			this.game.player.shoot();
			this.game.fired = true;
		}
	
		if (this.game.keys.indexOf(event.key) === -1) {
			this.game.keys.push(event.key);
		}
	
		if (event.key === 'r' && this.game.gameOver) {
			this.game.restart();
		}
	}

	handleKeyup(event) {
		this.game.fired = false;
		const idx = this.game.keys.indexOf(event.key);
		if (idx > -1) this.game.keys.splice(idx, 1);
	}

	updateGame(deltaTime) {
		this.game.updateState(deltaTime);
	}

	renderGame() {
		this.view.render();
	}
}
