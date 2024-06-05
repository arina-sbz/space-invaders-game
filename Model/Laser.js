/**
 * Represents a laser in the game.
 * @class
 */
export class Laser {
	/**
	 * Creates a new instance of the Laser class.
	 * @constructor
	 * @param {Game} game - The game object.
	 */
	constructor(game) {
		this.game = game;
		this.x = 0;
		this.y = 0;
		this.height = this.game.height - 50;
	}

	/**
	 * Updates the position of the laser.
	 */
	updatePosition() {
		this.x =
			this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5;
		this.game.player.energy -= this.damage;
	}

	/**
	 * Checks for collisions between the laser and enemies or bosses.
	 */
	checkCollisions() {
		this.game.waves.forEach((wave) => {
			wave.enemies.forEach((enemy) => {
				if (this.game.checkCollision(enemy, this)) {//Debugging code, to check if the laser hits the enemy
					console.log('-------------------');
					console.log('Laser hit enemy');
					console.log('-------------------');
					enemy.hit(this.damage);
				}
			});
		});

		this.game.bossArray.forEach((boss) => {//To check if the laser hits the boss, boss takes half the damage of a regular unit
			if (this.game.checkCollision(boss, this) && boss.y >= 0) {
				boss.hit(this.damage);
			}
		});
	}
}

export class SmallLaser extends Laser {
	constructor(game) {//Constructor for the small laser, has smalle width and damage
		super(game);
		this.width = 4;
		this.damage = 0.3;


	}
}

export class BigLaser extends Laser {
	constructor(game) {//Constructor for the big laser, has bigger width and damage
		super(game);
		this.width = 25;
		this.damage = 0.7;
	}
}
