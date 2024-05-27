export class Tutorial {
    constructor(game) {
        this.game = game;
        this.prompts = [
            "Use A-D to move left and right.",
            "Use W to fire a projectile.",
            "Use Q for a small laser.",
            "Use E for a big laser."
        ];
        this.currentPromptIndex = 0;
        this.finished = false;
        this.displayPrompt();
    }

    displayPrompt() {
        if (this.currentPromptIndex < this.prompts.length) {
            this.game.displayPrompt(this.prompts[this.currentPromptIndex]);
        } else {
            this.finished = true;
            this.game.clearPrompt();
        }
    }

    nextPrompt() {
        this.currentPromptIndex++;
        this.displayPrompt();
    }
}