const socket = io();

let myCarNumber;

function updatePlayerInfo(players) {
    const playerInfo = document.getElementById('playerInfo');
    if (players.length === 0) {
        playerInfo.textContent = 'Waiting for players...';
    } else {
        playerInfo.innerHTML = players.map(player =>
            `Car ${player.carNumber}: ${player.position}%`
        ).join('<br>');
    }

    // Update car visibility
    for (let i = 1; i <= 3; i++) {
        const carElement = document.querySelector(`#car${i}`);
        if (carElement) {
            carElement.style.display = players.some(p => p.carNumber === i) ? 'block' : 'none';
        }
    }
}

socket.on('assignCar', (carNumber) => {
    myCarNumber = carNumber;
    console.log(`You are car number ${carNumber}`);
    document.getElementById('playerInfo').textContent = `You are Car ${carNumber}. Waiting for other players...`;
});

socket.on('updatePlayers', (players) => {
    console.log('Players updated:', players);
    updatePlayerInfo(players);
});

socket.on('updatePositions', (players) => {
    players.forEach(player => {
        const carElement = document.querySelector(`#car${player.carNumber}`);
        if (carElement) {
            carElement.style.left = `${player.position}%`;
        }
    });
    updatePlayerInfo(players);
});

socket.on('gameOver', (winnerCar) => {
    alert(`Car ${winnerCar} wins!`);
});

socket.on('gameFull', () => {
    alert('Game is full. Please try again later.');
});

function moveCar(distance) {
    socket.emit('move', distance);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        moveCar(10); // Move 10% forward
    }
});

// Add this to ensure the race track is visible
document.addEventListener('DOMContentLoaded', () => {
    const raceTrack = document.getElementById('raceTrack');
    if (raceTrack) {
        raceTrack.style.display = 'block';
    }
});