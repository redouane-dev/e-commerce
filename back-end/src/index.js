'use strict';

const express = require('express');

// Constants
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

// Define app
const app = express();
app.get('/', (req, res) => {
    res.status(200).send('Be water my friend!');
});

app.listen(PORT, HOST);
console.log(`Server listening on http://${HOST}:${PORT}`);