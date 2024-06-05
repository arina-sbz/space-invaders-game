export class Enemy {
	constructor(game, positionX, positionY, imageKey) {
		this.game = game;
		this.width = this.game.enemySize;
		this.height = this.game.enemySize;
		this.x = 0;
		this.y = 0;
		this.positionX = positionX;
		this.positionY = positionY;
		this.beDeleted = false;
		this.imageKey = imageKey; // The key for the enemy's image
	}

	update(x, y) {
		this.x = x + this.positionX;
		this.y = y + this.positionY;

		// Check for collision with projectiles
		this.game.projectilesPool.forEach((projectile) => {
			if (
				!projectile.free &&
				this.game.checkCollision(this, projectile) &&
				this.lives > 0
			) {
				this.hit(1); // Reduce lives by 1
				projectile.reset(); // Reset the projectile
			}
		});

		if (this.lives < 1) {
			if (this.game.spriteUpdate) this.frameX++; // Update the sprite frame
			if (this.frameX > this.maxFrame) {
				this.beDeleted = true; // Mark the enemy for deletion
				if (!this.game.gameOver) this.game.score += this.maxLives; // Increase the score
			}
		}

		// Check for collision with the player
		if (this.game.checkCollision(this, this.game.player) && this.lives > 0) {
			this.lives = 0; // Set lives to 0
			this.game.player.lives--; // Reduce the player's lives
		}

		// Check if the enemy is out of bounds or the player has no lives left
		if (this.y + this.height > this.game.height || this.game.player.lives < 1) {
			this.game.gameOver = true; // Set the game over flag
		}
	}

	hit(damage) {
		this.lives -= damage; // Reduce lives by the specified damage
	}
}

export class Beetlemporph extends Enemy {
	constructor(game, positionX, positionY) {
		super(game, positionX, positionY, 'beetlemorph'); // Pass the image key
		this.frameX = 0;
		this.maxFrame = 2;
		this.frameY = Math.floor(Math.random() * 4);
		this.lives = 1;
		this.maxLives = this.lives;
	}
}

export class Rhinomorph extends Enemy {
	constructor(game, positionX, positionY) {
		super(game, positionX, positionY, 'rhinomorph'); // Pass the image key
		this.frameX = 0;
		this.maxFrame = 5;
		this.frameY = Math.floor(Math.random() * 4);
		this.lives = 4;
		this.maxLives = this.lives;
	}

	hit(damage) {
		this.lives -= damage; // Reduce lives by the specified damage
		this.frameX = this.maxLives - Math.floor(this.lives); // Update the sprite frame based on remaining lives
	}
}
