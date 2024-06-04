/**
 * Represents a Boss in the game.
 */
export class Boss {
	/**
	 * Creates a new instance of the Boss class.
	 * @param {object} game - The game object.
	 * @param {number} bossLives - The number of lives the boss has.
	 */
	constructor(game, bossLives) {
		this.game = game;
		this.width = 200;
		this.height = 200;
		this.x = this.game.width / 2 - this.width / 2;
		this.y = -this.height;
		this.speedX = (Math.random() < 0.5 ? -1 : 1) * 2;
		this.speedY = 0;
		this.lives = bossLives;
		this.maxLives = this.lives;
		this.beDeleted = false;
		this.image = document.getElementById('boss');
		this.frameX = 0;
		this.frameY = Math.floor(Math.random() * 4);
		this.maxFrame = 11;
	}

	/**
	 * Updates the boss's position and checks for collisions.
	 */
	update() {
		this.speedY = 0;
		if (this.game.spriteUpdate && this.lives >= 1) this.frameX = 0;
		if (this.y < 0) this.y += 8; // Increase from 4 to 8 to double the speed
		if (
			this.x < 0 ||
			(this.x > this.game.width - this.width && this.lives >= 1)
		) {
			this.speedX *= -1;
			this.speedY = this.height;
		}
		this.x += this.speedX;
		this.y += this.speedY;

		this.game.projectilesPool.forEach((projectile) => {//Boss life updater
			if (
				this.game.checkCollision(this, projectile) &&
				!projectile.free &&
				this.lives >= 1
			) {
				this.lives--;
				projectile.reset();
			}
		});

		if (this.game.checkCollision(this, this.game.player) && this.lives >= 1) {//Boss collision with player, automatically kills the player.
			this.game.gameOver = true;
			this.lives = 0;
		}

		if (this.lives < 1 && this.game.spriteUpdate) {//Check if the boss is dead or at the end every frame
			this.frameX++;
			if (this.frameX > this.maxFrame) {
				this.beDeleted = true;
				this.game.score += this.maxLives;
				this.game.bossLives += 5;
				if (!this.game.gameOver) this.game.newWave();
			}
		}

		if (this.y + this.height > this.game.height) this.game.gameOver = true;
	}

	/**
	 * Applies damage to the boss.
	 * @param {number} damage - The amount of damage to apply.
	 */
	hit(damage) {
		this.lives -= damage;
		if (this.lives >= 1) this.frameX = 1;
	}
}
