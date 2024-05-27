import { Beetlemporph, Rhinomorph } from './Enemy.js';
import { Tutorial } from './Tutorial.js';

export class Wave {
    constructor(game) {
        this.game = game;
        this.width = this.game.columns * this.game.enemySize;
        this.height = this.game.rows * this.game.enemySize;
        this.x = this.game.width / 2 - this.width / 2;
        this.y = -this.height;
        this.speedX = Math.random() < 0.5 ? -2 : 2;
        this.speedY = 0;
        this.enemies = [];
        this.nextWaveTrigger = false;
        this.markedForDeletion = false;
        this.create();

        // Initialize the tutorial
        if (!this.game.tutorial) {
            this.game.tutorial = new Tutorial(this.game);
        }
    }

    update() {
        if (this.y < 0) this.y += 5;
        this.speedY = 0;
        this.x += this.speedX;
        if (this.x < 0 || this.x > this.game.width - this.width) {
            this.speedX *= -1;
            this.speedY = this.game.enemySize;
        }
        this.x += this.speedX;
        this.y += this.speedY;
        this.enemies.forEach((enemy) => {
            enemy.update(this.x, this.y);
        });
        this.enemies = this.enemies.filter((enemy) => !enemy.beDeleted);
        if (this.enemies.length <= 0) this.markedForDeletion = true;

        // Check for player actions to advance the tutorial
        this.checkPlayerActions();
    }

    create() {
        for (let y = 0; y < this.game.rows; y++) {
            for (let x = 0; x < this.game.columns; x++) {
                let enemyX = x * this.game.enemySize;
                let enemyY = y * this.game.enemySize;
                if (Math.random() < 0.3) {
                    this.enemies.push(new Rhinomorph(this.game, enemyX, enemyY));
                } else {
                    this.enemies.push(new Beetlemporph(this.game, enemyX, enemyY));
                }
            }
        }
    }

    checkPlayerActions() {
        if (!this.game.tutorial.finished) {
            if (this.game.tutorial.currentPromptIndex === 0 && (this.game.keys['a'] || this.game.keys['d'])) {
                this.game.tutorial.nextPrompt();
            } else if (this.game.tutorial.currentPromptIndex === 1 && this.game.keys['w']) {
                this.game.tutorial.nextPrompt();
            } else if (this.game.tutorial.currentPromptIndex === 2 && this.game.keys['q']) {
                this.game.tutorial.nextPrompt();
            } else if (this.game.tutorial.currentPromptIndex === 3 && this.game.keys['e']) {
                this.game.tutorial.nextPrompt();
            }
        }
    }
}
