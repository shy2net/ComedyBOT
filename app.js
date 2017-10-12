const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    port = process.env.PORT || 3000;

// Allow parsing JSON data obtained from post
app.use(bodyParser.json());

// Allow serving static content
app.use(express.static(`${__dirname}/client`)); 

// Our routes
require(`./server/routes.js`)(app);

app.listen(port);										// let the games begin!
console.log(`Web server listening on port ${port}`);
