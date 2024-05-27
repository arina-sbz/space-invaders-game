import { Player } from './Player.js';
import { Wave } from './Wave.js';
import { Boss } from './Boss.js';
import { Projectile } from './Projectile.js';
import { Tutorial } from './Tutorial.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.isPaused = false;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.keys = {};
        this.images = {};
        this.imagesLoaded = false;
        this.loadImages();

        this.projectilesPool = [];
        this.numberOfProjectiles = 15;
        this.createProjectiles();
        this.fired = false;

        this.columns = 1;
        this.rows = 1;
        this.enemySize = 80;

        this.waves = [];
        this.waveCount = 1;

        this.spriteUpdate = false;
        this.spriteTimer = 0;
        this.spriteInterval = 120;

        this.score = 0;
        this.gameOver = false;

        this.bossArray = [];
        this.bossLives = 10;

        // Initialize tutorial
        this.tutorial = null;

        // Event listeners for key presses
        window.addEventListener('keydown', (e) => this.keyDown(e));
        window.addEventListener('keyup', (e) => this.keyUp(e));
    }

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
            loadImage('../images/player.png').then((img) => (this.images.player = img)),
            loadImage('../images/beetlemorph.png').then((img) => (this.images.beetlemorph = img)),
            loadImage('../images/rhinomorph.png').then((img) => (this.images.rhinomorph = img)),
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

    createProjectiles() {
        for (let i = 0; i < this.numberOfProjectiles; i++) {
            const projectile = new Projectile();
            this.projectilesPool.push(projectile);
        }
    }

    getProjectile() {
        for (let i = 0; i < this.projectilesPool.length; i++) {
            if (this.projectilesPool[i].free) {
                return this.projectilesPool[i];
            }
        }
    }

    checkCollision(rec1, rec2) {
        return (
            rec1.x < rec2.x + rec2.width &&
            rec1.x + rec1.width > rec2.x &&
            rec1.y < rec2.y + rec2.height &&
            rec1.y + rec1.height > rec2.y
        );
    }

    restart() {
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

        // Restart tutorial
        this.tutorial = new Tutorial(this);
    }

    updateState(deltaTime) {
        if (!this.imagesLoaded) return; // Ensure images are loaded before updating state

        if (this.spriteTimer > this.spriteInterval) {
            this.spriteUpdate = true;
            this.spriteTimer = 0;
        } else {
            this.spriteUpdate = false;
            this.spriteTimer += deltaTime;
        }

        this.projectilesPool.forEach((projectile) => {
            projectile.update();
        });

        if (this.player) {
            this.player.updatePosition();
        }

        this.bossArray.forEach((boss) => {
            boss.update();
        });

        this.bossArray = this.bossArray.filter((boss) => !boss.beDeleted);

        this.waves.forEach((wave) => {
            wave.update();
            if (wave.enemies.length < 1 && !wave.nextWaveTrigger && !this.gameOver) {
                this.newWave();
                wave.nextWaveTrigger = true;
            }
        });
    }

    newWave() {
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

    keyDown(e) {
        if (e.key === 'a') this.keys['a'] = true;
        if (e.key === 'd') this.keys['d'] = true;
        if (e.key === 'w') this.keys['w'] = true;
        if (e.key === 'q') this.keys['q'] = true;
        if (e.key === 'e') this.keys['e'] = true;
    }

    keyUp(e) {
        if (e.key === 'a') this.keys['a'] = false;
        if (e.key === 'd') this.keys['d'] = false;
        if (e.key === 'w') this.keys['w'] = false;
        if (e.key === 'q') this.keys['q'] = false;
        if (e.key === 'e') this.keys['e'] = false;
    }

    displayPrompt(prompt) {
        // Display the prompt on the screen
        console.log(prompt); // For simplicity, we'll use console.log. Replace with actual display logic.
    }

    clearPrompt() {
        // Clear the prompt display
        console.log(''); // Clear the console. Replace with actual display clear logic.
    }
}
