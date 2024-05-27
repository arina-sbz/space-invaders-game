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

		let lazorSound;
		let lazorSoundActive = false;

		// Function to play the lazor sound
		function playLazorSound() {
			if (!lazorSoundActive) { 
				lazorSound = document.getElementById("lazor-sound"); 
				lazorSound.loop = false; 
				lazorSound.play();
				lazorSoundActive = true;
			}
		}
	  
		// Function to stop the lazor sound
		function stopLazorSound() {
			if (lazorSoundActive) {
				lazorSound.pause();
				lazorSound.currentTime = 0; 
				lazorSoundActive = false;
			}
		}

		if (this.game.player.energy > 1 && !this.game.player.coolDown) {
			let laserActive = this.game.keys.indexOf('2') > -1 || 
			this.game.keys.indexOf('3') > -1 ||
			this.game.keys.indexOf('q') > -1 ||
			this.game.keys.indexOf('e') > -1;  

if (laserActive) {
playLazorSound();
} else {
stopLazorSound();
}

// Update and render small laser if '2' or 'q' key is pressed
if ((this.game.keys.indexOf('2') > -1 || this.game.keys.indexOf('q') > -1) && smallLaser) {
smallLaser.updatePosition();
smallLaser.checkCollisions(); // Check collisions
this.context.fillStyle = 'gold';
this.context.fillRect(smallLaser.x, smallLaser.y, smallLaser.width, smallLaser.height);
this.context.fillStyle = 'white';
this.context.fillRect(
  smallLaser.x + smallLaser.width * 0.2,
  smallLaser.y,
  smallLaser.width * 0.6,
  smallLaser.height
);
}

// Update and render big laser if '3' or 'e' key is pressed
if ((this.game.keys.indexOf('3') > -1 || this.game.keys.indexOf('e') > -1) && bigLaser) {
bigLaser.updatePosition();
bigLaser.checkCollisions(); // Check collisions
this.context.fillStyle = 'gold';
this.context.fillRect(bigLaser.x, bigLaser.y, bigLaser.width, bigLaser.height);
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
				this.context.font = `30px impact`;
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
		let isMobile = this.context.canvas.isMobile;

		// Adjust radius and font size based on isMobile
		let fontSize = isMobile ? '20px' : '30px';

		this.context.save();
		this.context.shadowOffsetX = 2;
		this.context.shadowOffsetY = 2;
		this.context.fillStyle = 'white';
		this.context.font = `${fontSize} impact`;

		// Adjust text positions based on font size
		this.context.fillText(
			'Score: ' + this.game.score + ' | ' + 'Wave: ' + this.game.waveCount,
			0,
			50
		);

		//Tutorial example #1
		// this.context.fillText(
		// 	'tutorial',
		// 	this.game.width / 2,
		// 	this.game.height / 2
		// );

		// Draw lives as smaller hearts
		this.context.save();
		let heartSize = isMobile ? 15 : 20;
		for (let i = 0; i < this.game.player.lives; i++) {
			this.drawHeart(10 + i * (heartSize + 5), 70, heartSize, 'red');
		}
		this.context.restore();

		// Draw energy bar
		this.context.save();
		let energy = this.game.player.energy;
		let maxEnergy = 100;
		let barWidth = this.game.width / 3; // Width of the energy bar
		let barHeight = 10; // Height of the energy bar
		let x = 0; // X position of the bar
		let y = 0; // Y position of the bar, adjusted to fit below hearts

		// Draw the background of the bar
		this.context.fillStyle = 'grey';
		this.context.fillRect(x, y, barWidth, barHeight);

		// Draw the energy level
		let energyWidth = (energy / maxEnergy) * barWidth;
		this.context.fillStyle = this.game.player.coolDown ? 'green' : 'gold';
		this.context.fillRect(x, y, energyWidth, barHeight);

		// Draw the border of the bar
		this.context.strokeStyle = 'black';
		this.context.strokeRect(x, y, barWidth, barHeight);
		this.context.restore();

		if (this.game.gameOver) {
			this.context.textAlign = 'center';
			this.context.font = isMobile ? '40px Impact' : '80px Impact';
			this.context.fillText(
				'Oops Game Over',
				this.game.width * 0.5,
				this.game.height * 0.5
			);
			this.context.font = isMobile ? '10px Impact' : '20px Impact';
			this.context.fillText(
				'Press R to restart',
				this.game.width * 0.5,
				this.game.height * 0.5 + 30
			);
		}
		this.context.restore();
	}

	drawHeart(x, y, size, color) {
		this.context.save();
		this.context.beginPath();
		let topCurveHeight = size * 0.3; // Make the heart less tall
		this.context.moveTo(x, y + topCurveHeight);
		this.context.bezierCurveTo(
			x,
			y,
			x - size / 2,
			y,
			x - size / 2,
			y + topCurveHeight
		);
		this.context.bezierCurveTo(
			x - size / 2,
			y + size / 1.5,
			x,
			y + size / 1.5,
			x,
			y + size
		);
		this.context.bezierCurveTo(
			x,
			y + size / 1.5,
			x + size / 2,
			y + size / 1.5,
			x + size / 2,
			y + topCurveHeight
		);
		this.context.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
		this.context.closePath();
		this.context.fillStyle = color;
		this.context.fill();
		this.context.restore();
	}
}
