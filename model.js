export class Laser {
	constructor(game) {
		this.game = game;
		this.x = 0;
		this.y = 0;
		this.height = this.game.height - 50;
	}

	updatePosition() {
		this.x =
			this.game.player.x + this.game.player.width * 0.5 - this.width * 0.5;
		this.game.player.energy -= this.damage;
	}

	checkCollisions() {
		this.game.waves.forEach((wave) => {
			wave.enemies.forEach((enemy) => {
				if (this.game.checkCollision(enemy, this)) {
					enemy.hit(this.damage);
				}
			});
		});

		this.game.bossArray.forEach((boss) => {
			if (this.game.checkCollision(boss, this) && boss.y >= 0) {
				boss.hit(this.damage);
			}
		});
	}
}

export class SmallLaser extends Laser {
	constructor(game) {
		super(game);
		this.width = 4;
		this.damage = 0.3;
	}
}

export class BigLaser extends Laser {
	constructor(game) {
		super(game);
		this.width = 25;
		this.damage = 0.7;
	}
}

export class Player {
	constructor(game) {
		this.game = game;
		this.width = 140;
		this.height = 120;
		this.x = this.game.width / 2 - this.width / 2;
		this.y = this.game.height - this.height;
		this.speed = 5;
		this.lives = 3;
		this.maxLives = 10;
		this.energy = 50;
		this.maxEnergy = 100;
		this.energyRecovery = 0.1;
		this.coolDown = false;
		this.smallLaser = new SmallLaser(this.game);
		this.bigLaser = new BigLaser(this.game);
	}

	updatePosition() {
		// Update player position and energy here
		if (this.energy < this.maxEnergy) this.energy += this.energyRecovery;
		if (this.energy < 1) this.coolDown = true;
		else if (this.energy > this.maxEnergy * 0.2) this.coolDown = false;

		if (this.game.keys.indexOf('ArrowLeft') > -1) {
			this.x -= this.speed;
		} else if (this.game.keys.indexOf('ArrowRight') > -1) {
			this.x += this.speed;
		}

		// Horizontal boundaries
		if (this.x < -this.width * 0.5) this.x = -this.width * 0.5;
		else if (this.x > this.game.width - this.width * 0.5) {
			this.x = this.game.width - this.width * 0.5;
		}
	}

	shoot() {
		const projectile = this.game.getProjectile();
		if (projectile) projectile.start(this.x + this.width * 0.5, this.y);

	}
}
