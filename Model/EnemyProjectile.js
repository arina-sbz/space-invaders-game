/**
 * Represents an enemy projectile in the game.
 */
export class EnemyProjectile {
	/**
	 * Creates a new instance of EnemyProjectile.
	 * @param {number} x - The x-coordinate of the projectile.
	 * @param {number} y - The y-coordinate of the projectile.
	 * @param {number} velocity - The velocity of the projectile.
	 * @param {number} [width=5] - The width of the projectile.
	 * @param {number} [height=10] - The height of the projectile.
	 */
	constructor(x, y, velocity, width = 5, height = 10) {//Constructor for the enemy projectile, similar to the player projectile
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.width = width;
		this.height = height;
		this.type = 'enemy'; // Enemy projectile type
		this.free = false;//This is to check if the projectile is free, i.e has already did not damage anything. Used to prevent double damage by single projectile
	}

	/**
	 * Draws the enemy projectile on the canvas.
	 * @param {CanvasRenderingContext2D} context - The rendering context of the canvas.
	 */
	draw(context) {
		context.fillStyle = 'red';
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	/**
	 * Updates the position of the enemy projectile.
	 */
	update() {
		this.y += this.velocity;
	}

	/**
	 * Checks if the enemy projectile is off the screen.
	 * @param {number} canvasHeight - The height of the canvas.
	 * @returns {boolean} - True if the projectile is off the screen, false otherwise.
	 */
	isOffScreen(canvasHeight) {
		return this.y > canvasHeight;
	}

	/**
	 * Checks if the enemy projectile hits the player.
	 * @param {Player} player - The player object.
	 * @returns {boolean} - True if the projectile hits the player, false otherwise.
	 */
	hitsPlayer(player) {
		return (
			this.x < player.x + player.width &&
			this.x + this.width > player.x &&
			this.y < player.y + player.height &&
			this.y + this.height > player.y
		);
	}
	reset() {
		this.free = true;
	}
}
