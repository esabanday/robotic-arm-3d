const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// Store connected players
let players = {};
let availableCarNumbers = [1, 2, 3];

io.on('connection', (socket) => {
    console.log('New player connected');

    // Assign player to a car
    if (availableCarNumbers.length > 0) {
        let carNumber = availableCarNumbers.shift(); // Get the first available car number
        players[socket.id] = { carNumber, position: 0 };
        socket.emit('assignCar', carNumber);

        // Broadcast updated player list
        io.emit('updatePlayers', Object.values(players));

        // Handle player movement
        socket.on('move', (distance) => {
            players[socket.id].position += distance;
            io.emit('updatePositions', Object.values(players));

            // Check for winner
            if (players[socket.id].position >= 100) {
                io.emit('gameOver', players[socket.id].carNumber);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            if (players[socket.id]) {
                availableCarNumbers.push(players[socket.id].carNumber); // Make the car number available again
                delete players[socket.id];
                io.emit('updatePlayers', Object.values(players));
            }
        });
    } else {
        socket.emit('gameFull');
        socket.disconnect();
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));