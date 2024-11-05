const MAX_TRIES = 10;
const WORDS = ["agadir", "Istanbul", "California", "Venice"];
let word, guessedChars, triesLeft;
let players = [
    { name: "Esa", score: 0 },
    { name: "Zainab", score: 0 },
    { name: "Naeema", score: 0 },
    { name: "Dania", score: 0 },
    { name: "Zakaria", score: 0 }
];
let currentPlayerIndex = 0;


const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 300;

function initGame() {
    console.log("Initializing game");
    word = WORDS[Math.floor(Math.random() * WORDS.length)];
    guessedChars = new Set();
    triesLeft = MAX_TRIES;
    currentPlayerIndex = 0;
    players.forEach(player => player.score = 0);
    updateDisplay();
    drawHangman();
    updateRaceTrack();
}
function updateDisplay() {
    console.log("Updating display");
    drawHangman();
    document.getElementById('currentPlayer').textContent = players[currentPlayerIndex].name;
    const wordPlaceholder = word.split('').map(ch => guessedChars.has(ch) ? ch : '_').join(' ');
    document.getElementById('word').textContent = wordPlaceholder;
    updateGuessedLetters();
}
// ... (previous code remains the same)
function makeGuess() {
    console.log("Making a guess");
    let guess = document.getElementById('guessInput').value.toLowerCase();
    document.getElementById('guessInput').value = '';

    if (guess.length !== 1) {
        console.log("Please enter a single character.");
        return;
    }

    if (guessedChars.has(guess)) {
        console.log("You've already guessed that character.");
        return;
    }

    guessedChars.add(guess);

    if (word.includes(guess)) {
        console.log("Good guess!");
        players[currentPlayerIndex].score++;
        updateRaceTrack();

        // Start flash animation for player 1 or 5
        if (currentPlayerIndex === 0 || currentPlayerIndex === 4) {
            startFlashAnimation();
        }
    } else {
        console.log("Oops! That letter is not in the word.");
        triesLeft--;
    }

    updateDisplay();

    if (word.split('').every(ch => guessedChars.has(ch))) {
        setTimeout(() => {
            alert("Congratulations, you've won!");
            initGame();
        }, 100);
    } else if (triesLeft === 0) {
        setTimeout(() => {
            alert(`You've lost! The word was '${word}'`);
            initGame();
        }, 100);
    } else {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateDisplay();
    }
}

function updateRaceTrack() {
    if (window.updateCarPositions) {
        window.updateCarPositions(players.map(player => player.score), currentPlayerIndex);
    }
}

function updateGuessedLetters() {
    const guessedLettersElement = document.getElementById('guessedLetters');
    guessedLettersElement.textContent = Array.from(guessedChars).join(', ');
}
// ... (rest of the hangman.js code, including drawHangman function)

// Make playerScores accessible to raceTrack.js
window.playerScores = players.map(player => player.score);

function clearCanvas() {
    console.log("Clearing canvas");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawDashedLine(x1, y1, x2, y2, dashLength = 5) {
    ctx.beginPath();
    ctx.setLineDash([dashLength, dashLength]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.setLineDash([]); // Reset to solid line
}
function drawHangman() {
    console.log('Drawing hangman');
    clearCanvas();

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.fillStyle = '#ffffff';

    // Draw the word placeholder
    const wordPlaceholder = word.split('').map(ch => guessedChars.has(ch) ? ch : '_').join(' ');
    ctx.font = '24px Arial';
    ctx.fillText(wordPlaceholder, 20, 280);

    // Helper function to draw dashed lines
    function drawDashedLine(x1, y1, x2, y2, dashLength = 5) {
        ctx.beginPath();
        ctx.setLineDash([dashLength, dashLength]);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
    }

    // Base
    drawDashedLine(50, 250, 250, 250);

    if (triesLeft < MAX_TRIES) {
        // Pole
        ctx.beginPath();
        ctx.moveTo(100, 250);
        ctx.lineTo(100, 50);
        ctx.stroke();
    }

    if (triesLeft < MAX_TRIES - 1) {
        // Top bar
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(200, 50);
        ctx.stroke();
    }

    if (triesLeft < MAX_TRIES - 2) {
        // Noose
        drawDashedLine(200, 50, 200, 80);
    }

    if (triesLeft < MAX_TRIES - 3) {
        // Head
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
    }

    if (triesLeft < MAX_TRIES - 4) {
        // Body
        drawDashedLine(200, 120, 200, 190);
    }

    if (triesLeft < MAX_TRIES - 5) {
        // Left arm
        drawDashedLine(200, 140, 170, 160);
    }

    if (triesLeft < MAX_TRIES - 6) {
        // Right arm
        drawDashedLine(200, 140, 230, 160);
    }

    if (triesLeft < MAX_TRIES - 7) {
        // Left leg
        drawDashedLine(200, 190, 170, 230);
    }

    if (triesLeft < MAX_TRIES - 8) {
        // Right leg
        drawDashedLine(200, 190, 230, 230);
    }
}
initGame();