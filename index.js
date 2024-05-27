import { Game } from './Model/Game.js';
import { GameView } from './view.js';
import { GameController } from './controller.js';

window.addEventListener('load', function () {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');
	let startPage = true;
	let isPaused = false;
	let tutorialActive = false;
	const tutorialText = document.getElementById("tutorialText");
	let hasMoved = false; // Flag to track if the player has moved

	let backgroundMusic = document.getElementById('background-music');
	function playMusic() {//Starts the background music with the start button
		backgroundMusic
			.play()
		document.removeEventListener('click', playMusic);
	}

	// Add event listener for user interaction
	document.addEventListener('click', playMusic);

	function setCanvasSize() {
		if (window.innerWidth > 1200) {
			canvas.isMobile = false;
			canvas.width = 1000;
			canvas.height = window.innerHeight - 10;
		} else if (window.innerWidth < 500) {
			canvas.isMobile = true;
			canvas.width = 400;
			canvas.height = 900;
		} else {
			canvas.isMobile = false;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
	}
	// Inside the startTutorial function
	function startTutorial() {
		console.log("startTutorial function called");  
		tutorialActive = true;
		tutorialText.textContent = "Press A to move left, D to move right."; 
		tutorialText.style.display = "block"; 
		tutorialText.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; 
		tutorialText.style.zIndex = 9999; 
		console.log("tutorialText styles:", getComputedStyle(tutorialText));
	}
	  
	function updateTutorialText() {
		if (!tutorialActive) return; // Tutorial not active
	
		if (hasMoved) {
			tutorialText.textContent = "Press Q, W, or E to use different weapons.";
		} else {
			tutorialText.textContent = "Press A to move left, D to move right.";
		}
	}
	
	function endTutorial() {
		tutorialActive = false;
		tutorialText.style.display = "none"; 
		tutorialText.textContent = "";
		tutorialText.style.zIndex = -1;
		tutorialText.style.backgroundColor = "transparent";
	}

	window.addEventListener('keydown', function (event) {
		if (event.key === 'a') {
			hasMoved=true;
			updateTutorialText();
		}
		else if (event.key === 'd') {
			hasMoved=true;
			updateTutorialText();
		}
		else if (event.key === 'q' && hasMoved===true){
			endTutorial();
		}
	});

	document
		.getElementById('start-game-button')
		.addEventListener('click', function () {
			document.getElementById('start-page').style.display = 'none';
			document.getElementById('game-content').style.display = 'block';			
			startTutorial();
			playMusic();
		});

	document
		.getElementById('change-language-button')
		.addEventListener('click', function () {
			alert('Change language functionality not implemented yet.');
		});

	// Set the initial canvas size
	setCanvasSize();

	// Resize the canvas when the window is resized
	window.addEventListener('resize', setCanvasSize);

	const game = new Game(canvas);
	const view = new GameView(game, ctx);
	const controller = new GameController(game, view);

	let lastTime = 0;

	// Ball object for the pause screen animation
	const ball = {
		x: canvas.width / 2,
		y: canvas.height / 2,
		radius: 20,
		dx: 4,
		dy: 4,
	};

	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;

		if (!isPaused) {
			controller.updateGame(deltaTime);
			controller.renderGame();
		} else {
			displayPauseScreen();
			updateBall();
		}
		window.requestAnimationFrame(animate);
	}
	animate(0);

	window.addEventListener('keydown', function (event) {
		if (event.key === 'Escape') {
			isPaused = !isPaused;
		}
	});

	function displayPauseScreen() {
		ctx.save();
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = 'white';
		ctx.font = '48px serif';
		ctx.textAlign = 'center';

		const lines = ['Game Paused', 'Press ESC to Resume', 'Enjoy your break!'];

		lines.forEach((line, index) => {
			ctx.fillText(line, canvas.width / 2, canvas.height / 2 - 60 + index * 60);
		});

		// Draw the ball
		drawBall();

		ctx.restore();
	}

	function drawBall() {
		ctx.beginPath();
		ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
		ctx.fillStyle = 'red';
		ctx.fill();
		ctx.closePath();
	}

	function updateBall() {
		ball.x += ball.dx;
		ball.y += ball.dy;

		// Check for collisions with the canvas edges
		if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
			ball.dx *= -1;
		}
		if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
			ball.dy *= -1;
		}
	}
});
