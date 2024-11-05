const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the robotic-arm directory
// Add this near the top of your file
const fs = require('fs');

// Add this before your routes
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Modify your static file serving to include error logging
app.use('/robotics', (req, res, next) => {
    const filePath = path.join(__dirname, 'robotics', req.url);
    fs.access(filePath, fs.constants.R_OK, (err) => {
        if (err) {
            console.error(`File not accessible: ${filePath}`);
            res.status(404).send('File not found');
        } else {
            next();
        }
    });
}, express.static(path.join(__dirname, 'robotics')));

// Do the same for the hangman route if needed

// Serve static files from the hangman directory
app.use('/hangman', express.static(path.join(__dirname, 'hangman')));

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});