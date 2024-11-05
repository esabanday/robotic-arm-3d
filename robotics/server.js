const express = require('express');
const path = require('path');
const app = express();
const port = 3002; // or any other port you prefer

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for robotic-arm.html
app.get('/robotic-arm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'robotic-arm.html'));
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(() => {
            server.close();
            server.listen(port);
        }, 1000);
    } else {
        console.error('Server error:', e);
    }
});
