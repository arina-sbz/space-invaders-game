import { SmallLaser, BigLaser } from './Laser.js';

export class Player {
	constructor(game) {
		this.game = game;
		this.width = 140;
		this.height = 120;
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height - this.height;
		this.speed = 10;
		this.lives = 1;
		this.maxLives = 10;
		this.energy = 50;
		this.maxEnergy = 100;
		this.coolDown = false;
		this.smallLaser = new SmallLaser(this.game);
		this.bigLaser = new BigLaser(this.game);
	}

	updatePosition() {//Updates the player's position, and reduces health if hit by an enemy projectile and updates the player's energy
		if (this.energy < this.maxEnergy) this.energy += 0.025;
		if (this.energy < 1) this.coolDown = true;
		else if (this.energy > this.maxEnergy * 0.2) this.coolDown = false;

		if (this.game.keys.indexOf('ArrowLeft') > -1 || this.game.keys.indexOf('a') > -1) {  // Check for 'a' (lowercase)
			this.x -= this.speed;
		} else if (this.game.keys.indexOf('ArrowRight') > -1 || this.game.keys.indexOf('d') > -1) {  // Check for 'd' (lowercase)
			this.x += this.speed;
		}

		if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
		else if (this.x > this.game.width - this.width * 0.5) {
			this.x = this.game.width - this.width * 0.5;
		}
		this.game.projectilesPool.forEach((projectile) => {//Player life updater
			if (
				this.game.checkCollision(this,projectile) &&
				!projectile.free &&
				this.lives >= 1 && projectile.type === 'enemy'
				
			)
			{
				this.lives--;
				projectile.free=true;
				projectile.reset();
				console.log('Player hit by enemy projectile');
			}
		});
	}

	shoot() {//Fires a projectile
		const projectile = this.game.getProjectile();
		if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
	}

	restart() {//Resets the player's position and lives if the game is restarted
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height - this.height;
		this.lives = 3;
	}
}
