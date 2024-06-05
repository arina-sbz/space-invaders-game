import { Game } from './Model/Game.js';
import { GameView } from './view.js';
import { GameController } from './controller.js';
import { translations } from "./dictionary.js";
export let language = "en"; // Expose the variable itself

window.addEventListener('load', function () {
	const canvas = document.getElementById('gameCanvas');
	const ctx = canvas.getContext('2d');
	let startPage = true;
	let isPaused = false;
	let ispausedbytutorial = false;
	let tutorialActive = false;
	const tutorialText = document.getElementById("tutorialText");
	let hasMoved = false; // Flag to track if the player has moved, for tutorial
	let hasfiredProjectile = false; // Flag to track if the player has fired a projectile, for tutorial

	const welcomeMessageElement = document.getElementById("start-page").querySelector("h1");
	const startGameButton = document.getElementById("start-game-button");

		// Add event listener for changing language to English
		document.getElementById('us-flag-button').addEventListener('click', function () {
			changeLanguage('en');
		});
	
		// Add event listener for changing language to Turkish
		document.getElementById('turkey-flag-button').addEventListener('click', function () {
			changeLanguage('tr');
		});
	
		// Add event listener for changing language to Persian
		document.getElementById('iran-flag-button').addEventListener('click', function () {
			changeLanguage('fa');
		});
	
		// Function to change language
		function changeLanguage(lang) {
			language = lang;
			translatePage();
		}

	
		function translatePage() {
			welcomeMessageElement.textContent = translations.welcomeMessage[language];
			startGameButton.textContent = translations.Start[language];
	
			// Other Translations
		}


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
		tutorialText.textContent = translations.TutorialText1[language]; 
		tutorialText.style.display = "block"; 
		tutorialText.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; 
		tutorialText.style.zIndex = 9999; 
		console.log("tutorialText styles:", getComputedStyle(tutorialText));
		ispausedbytutorial = true;
	}
	  
	function updateTutorialText() {
		if (!tutorialActive) return; // Tutorial not active

		if (hasMoved && hasfiredProjectile) {	
			tutorialText.textContent = translations.TutorialText3[language];
			//ispausedbytutorial = true;
		}
		else if (hasMoved) {
			tutorialText.textContent = translations.TutorialText2[language];
			//ispausedbytutorial = true;
		} 
		else {
			tutorialText.textContent = translations.TutorialText1[language];
		}
	
	}
	
	function endTutorial() {
		tutorialActive = false;
		tutorialText.style.display = "none"; 
		tutorialText.textContent = "";
		tutorialText.style.zIndex = -1;
		tutorialText.style.backgroundColor = "transparent";		
		ispausedbytutorial = false;
	}

	window.addEventListener('keydown', function (event) {
		if (event.key === 'a' || event.key === 'd' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			hasMoved=true;
			updateTutorialText();
		}
		else if ((event.key === 'w' && hasMoved===true)||(event.key === '1' && hasMoved===true)) {
			hasfiredProjectile=true;
			updateTutorialText();
		}
		else if ((event.key === 'q' && hasMoved===true)||(event.key === '2' && hasMoved===true) ||(event.key === 'e' && hasMoved===true)||(event.key === '3' && hasMoved===true)) {
			endTutorial();
		}
		;
	});

	document
		.getElementById('start-game-button')
		.addEventListener('click', function () {
			document.getElementById('start-page').style.display = 'none';
			document.getElementById('game-content').style.display = 'block';			
			startTutorial();
			playMusic();
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

		if (!isPaused && !ispausedbytutorial) {
			controller.updateGame(deltaTime);
			controller.renderGame();
		}
		else if(ispausedbytutorial){
			//Wait for user input			
		} 
		else {
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

	/**
	 * Displays the pause screen on the canvas.
	 */
	function displayPauseScreen() {
		ctx.save();
		ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = 'white';
		ctx.font = '48px serif';
		ctx.textAlign = 'center';

		const lines = translations.PauseLines[language];

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
