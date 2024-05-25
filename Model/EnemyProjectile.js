export class EnemyProjectile {
	constructor(x, y, velocity, width = 5, height = 10) {
		this.x = x;
		this.y = y;
		this.velocity = velocity;
		this.width = width;
		this.height = height;
	}

	draw(context) {
		context.fillStyle = 'red';
		context.fillRect(this.x, this.y, this.width, this.height);
	}

	update() {
		this.y += this.velocity;
	}

	isOffScreen(canvasHeight) {
		return this.y > canvasHeight;
	}

	hitsPlayer(player) {
		return (
			this.x < player.x + player.width &&
			this.x + this.width > player.x &&
			this.y < player.y + player.height &&
			this.y + this.height > player.y
		);
	}
}
