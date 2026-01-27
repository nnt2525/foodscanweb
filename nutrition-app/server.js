const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from current directory (to access css, js, HTML folders)
app.use(express.static(__dirname));

// Redirect root to HTML/index.html
app.get('/', (req, res) => {
    res.redirect('/HTML/index.html');
});

// Start server
app.listen(PORT, () => {
    console.log(` NutriTrack Server running at http://localhost:${PORT}`);
    console.log(` Serving files from: ${__dirname}`);
    console.log(` Open http://localhost:${PORT} in your browser`);
});