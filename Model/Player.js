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

	updatePosition() {
		if (this.energy < this.maxEnergy) this.energy += 0.025;
		if (this.energy < 1) this.coolDown = true;
		else if (this.energy > this.maxEnergy * 0.2) this.coolDown = false;

		if (this.game.keys.indexOf('ArrowLeft') > -1) {
			this.x -= this.speed;
		} else if (this.game.keys.indexOf('ArrowRight') > -1) {
			this.x += this.speed;
		}

		if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
		else if (this.x > this.game.width - this.width * 0.5) {
			this.x = this.game.width - this.width * 0.5;
		}
	}

	shoot() {
		const projectile = this.game.getProjectile();
		if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
	}

	restart() {
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height - this.height;
		this.lives = 3;
	}
}
