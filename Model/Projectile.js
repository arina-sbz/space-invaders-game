export class Projectile {
	constructor() {
		this.width = 3;
		this.height = 20;
		this.x = 0;
		this.y = 0;
		this.speed = 20;
		this.free = true;//This is to check if the projectile is free, i.e has already did not damage anything. Used to prevent double damage by single projectile
		this.soundPlaying = false; // Flag to track sound status
		this.type = "player";//Player projectile type
	}

	update() {
		if (!this.free) {
			this.y -= this.speed;
			if (this.y < -this.height) this.reset();
		}
	}

	start(x, y) {
		this.x = x - this.width * 0.5;
		this.y = y;
		this.free = false;

        // Play pew sound only if it's not already playing
        const pewSound = document.getElementById("pew-sound");
        if (pewSound.paused) { // Check if the sound is paused
            pewSound.currentTime = 0; // Reset playback position
            pewSound.loop = false; // Disable looping 
            pewSound.play();
        }		
	}

	reset() {
		this.free = true;
	}
}
