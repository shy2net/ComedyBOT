const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    path = require('path'),
    http = require('http').Server(app);
    io = require('socket.io')(http),
    port = process.env.PORT || 3000;

// Allow parsing JSON data obtained from post
app.use(bodyParser.json());

// Allow serving static content
app.use(express.static(`${__dirname}/client`)); 

// Our routes
require(`./server/routes.js`)(app,io);

http.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
});	

