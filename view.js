export class GameView {
	constructor(game, context) {
		this.game = game;
		this.context = context;
	}

	render() {
		if (!this.game.imagesLoaded) return;

		this.context.clearRect(0, 0, this.game.width, this.game.height);
		this.renderPlayer();
		this.renderLasers();
		this.renderProjectiles();
		this.renderEnemies();
		this.renderBosses();
		this.drawStatusText();
	}

	renderPlayer() {
		if (this.game.keys.indexOf('1') > -1) {
			this.frameX = 1;
		} else {
			this.frameX = 0;
		}

		const player = this.game.player;

		this.context.drawImage(
			this.game.images.player,
			this.frameX * player.width,
			0,
			player.width,
			player.height,
			player.x,
			player.y,
			player.width,
			player.height
		);
	}

	renderLasers() {
		const smallLaser = this.game.player.smallLaser;
		const bigLaser = this.game.player.bigLaser;

		if (this.game.player.energy > 1 && !this.game.player.coolDown) {
			// Update and render small laser if '2' key is pressed
			if (this.game.keys.indexOf('2') > -1 && smallLaser) {
				smallLaser.updatePosition();
				smallLaser.checkCollisions(); // Check collisions
				this.context.fillStyle = 'gold';
				this.context.fillRect(
					smallLaser.x,
					smallLaser.y,
					smallLaser.width,
					smallLaser.height
				);
				this.context.fillStyle = 'white';
				this.context.fillRect(
					smallLaser.x + smallLaser.width * 0.2,
					smallLaser.y,
					smallLaser.width * 0.6,
					smallLaser.height
				);
			}

			// Update and render big laser if '3' key is pressed
			if (this.game.keys.indexOf('3') > -1 && bigLaser) {
				bigLaser.updatePosition();
				bigLaser.checkCollisions(); // Check collisions
				this.context.fillStyle = 'gold';
				this.context.fillRect(
					bigLaser.x,
					bigLaser.y,
					bigLaser.width,
					bigLaser.height
				);
				this.context.fillStyle = 'white';
				this.context.fillRect(
					bigLaser.x + bigLaser.width * 0.2,
					bigLaser.y,
					bigLaser.width * 0.6,
					bigLaser.height
				);
			}
		}
	}

	renderProjectiles() {
		this.game.projectilesPool.forEach((projectile) => {
			if (!projectile.free) {
				this.context.save();
				this.context.fillStyle = 'gold';
				this.context.fillRect(
					projectile.x,
					projectile.y,
					projectile.width,
					projectile.height
				);
				this.context.restore();
			}
		});
	}

	renderEnemies() {
		this.game.waves.forEach((wave) => {
			wave.enemies.forEach((enemy) => {
				this.context.drawImage(
					this.game.images[enemy.imageKey],
					enemy.frameX * enemy.width,
					enemy.frameY * enemy.height,
					enemy.width,
					enemy.height,
					enemy.x,
					enemy.y,
					enemy.width,
					enemy.height
				);
			});
		});
	}

	renderBosses() {
		this.game.bossArray.forEach((boss) => {
			this.context.drawImage(
				this.game.images.boss,
				boss.frameX * boss.width,
				boss.frameY * boss.height,
				boss.width,
				boss.height,
				boss.x,
				boss.y,
				boss.width,
				boss.height
			);

			if (boss.lives >= 1) {
				this.context.save();
				this.context.textAlign = 'center';
				this.context.fillText(
					Math.floor(boss.lives),
					boss.x + boss.width * 0.5,
					boss.y + 50
				);
				this.context.restore();
			}
		});
	}

	drawStatusText() {
		this.context.save();
		this.context.shadowOffsetX = 2;
		this.context.shadowOffsetY = 2;
		this.context.shadowColor = 'black';
		this.context.fillText('Score: ' + this.game.score, 20, 40);
		this.context.fillText('Wave: ' + this.game.waveCount, 20, 80);
		for (let i = 0; i < this.game.player.maxLives; i++) {
			this.context.strokeRect(20 + 20 * i, 100, 10, 15);
		}
		for (let i = 0; i < this.game.player.lives; i++) {
			this.context.fillRect(20 + 20 * i, 100, 10, 15);
		}

		// Draw energy
		this.context.save();
		this.game.player.coolDown
			? (this.context.fillStyle = 'red')
			: (this.context.fillStyle = 'gold');
		for (let i = 0; i < this.game.player.energy; i++) {
			this.context.fillRect(20 + 2 * i, 130, 2, 15);
		}
		this.context.restore();

		if (this.game.gameOver) {
			this.context.textAlign = 'center';
			this.context.font = '80px Impact';
			this.context.fillText(
				'Oops Game Over',
				this.game.width * 0.5,
				this.game.height * 0.5
			);
			this.context.font = '20px Impact';
			this.context.fillText(
				'Press R to restart',
				this.game.width * 0.5,
				this.game.height * 0.5 + 30
			);
		}
		this.context.restore();
	}
}
