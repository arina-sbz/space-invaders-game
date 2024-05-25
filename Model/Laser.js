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
					console.log('-------------------');
					console.log('Laser hit enemy');
					console.log('-------------------');
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
