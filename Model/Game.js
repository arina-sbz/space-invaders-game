import { Player } from './Player.js';
import { Wave } from './Wave.js';
import { Boss } from './Boss.js';
import { Projectile } from './Projectile.js';
import { EnemyProjectile } from './EnemyProjectile.js';

export class Game {//Main game model
	constructor(canvas) {this.canvas = canvas; // The canvas element where the game is drawn
	this.isPaused = false; // Whether the game is paused
	this.width = this.canvas.width; // The width of the game area
	this.height = this.canvas.height; // The height of the game area
	this.keys = []; // Array to store the state of the keyboard keys
	this.images = {}; // Object to store the game images
	this.imagesLoaded = false; // Whether the game images have been loaded
	this.loadImages(); // Call the method to load the game images

	this.projectilesPool = []; // Pool of projectiles
	this.numberOfProjectiles = 15; // Number of projectiles in the pool
	this.createProjectiles(); // Call the method to create the projectiles
	this.fired = false; // Whether a projectile has been fired

	this.columns = 1; // Number of enemy columns
	this.rows = 1; // Number of enemy rows
	this.enemySize = 80; // Size of the enemies

	this.waves = []; // Array to store the enemy waves
	this.waveCount = 1; // The current wave number

	this.spriteUpdate = false; // Whether the sprite needs to be updated
	this.spriteTimer = 0; // Timer for the sprite update
	this.spriteInterval = 120; // Interval between sprite updates

	this.score = 0; // The player's score
	this.gameOver = false; // Whether the game is over

	this.bossArray = []; // Array to store the bosses
	this.bossLives = 10; // The number of lives the boss has
	}
	// Method to load the game images
	loadImages() {
		const loadImage = (src) => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.src = src;
				img.onload = () => resolve(img);
				img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
			});
		};

		Promise.all([
			loadImage('../images/player.png').then(
				(img) => (this.images.player = img)
			),
			loadImage('../images/beetlemorph.png').then(
				(img) => (this.images.beetlemorph = img)
			),
			loadImage('../images/rhinomorph.png').then(
				(img) => (this.images.rhinomorph = img)
			),
			loadImage('../images/boss.png').then((img) => (this.images.boss = img)),
		])
			.then(() => {
				this.imagesLoaded = true;
				this.player = new Player(this);

				this.restart();
			})
			.catch((err) => {
				console.error(err);
			});
	}

	createProjectiles() {//Old method to create projectiles
		for (let i = 0; i < this.numberOfProjectiles; i++) {
			const projectile = new Projectile();
			this.projectilesPool.push(projectile);
		}
	}

	getProjectile() {//New method to get a projectile from the pool to check if it hit anything
		for (let i = 0; i < this.projectilesPool.length; i++) {
			if (this.projectilesPool[i].free) {
				return this.projectilesPool[i];
			}
		}
	}

	checkCollision(rec1, rec2) {//New method to check for collisions
		return (
			rec1.x < rec2.x + rec2.width &&
			rec1.x + rec1.width > rec2.x &&
			rec1.y < rec2.y + rec2.height &&
			rec1.y + rec1.height > rec2.y
		);
	}
	
	// hitsPlayer() {//New method to check if the player was hit by a projectile
	// 	EnemyProjectile.hitsPlayer(player);
	// }

	restart() {//Restart function to reset the game
		if (this.player) {
			this.player.restart();
		}
		this.columns = 1;
		this.rows = 1;
		this.waves = [];
		this.bossArray = [];
		this.bossLives = 10;
		this.waves.push(new Wave(this));
		this.waveCount = 1;
		this.score = 0;
		this.gameOver = false;
	}

	updateState(deltaTime) {//This is the function that updates the every frame
		if (!this.imagesLoaded) return; // Ensure images are loaded before updating state

		if (this.spriteTimer > this.spriteInterval) {
			this.spriteUpdate = true;
			this.spriteTimer = 0;
		} else {
			this.spriteUpdate = false;
			this.spriteTimer += deltaTime;
		}

		this.projectilesPool.forEach((projectile) => {//Update the projectiles
			projectile.update();
			if (projectile.type==='enemy' && projectile.y > this.height) {
				projectile.free = true;
			}
		});

		if (this.player) {//ipdate the player
			this.player.updatePosition();
		}

		this.bossArray.forEach((boss) => {
			boss.update();
		});

		this.bossArray = this.bossArray.filter((boss) => !boss.beDeleted);//Check the bosses to see if they are marked for deletion

		this.waves.forEach((wave) => {//Create the new wave
			wave.update();
			if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
				this.newWave();
				wave.nextWaveTrigger = true;
			}
		});
	}

	newWave() {//Creator for the new wave
		this.waveCount++;
		if (this.player.lives < this.player.maxLives) this.player.lives++;
		if (this.waveCount % 5 === 0) {
			this.bossArray.push(new Boss(this, this.bossLives));
		} else {
			if (
				Math.random() < 0.5 &&
				this.columns * this.enemySize < this.width * 0.8
			) {
				this.columns++;
			} else if (this.rows * this.enemySize < this.height * 0.6) {
				this.rows++;
			}
			this.waves.push(new Wave(this));
			this.waves = this.waves.filter((wave) => !wave.markedForDeletion);
		}
	}
}
