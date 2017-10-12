const comedyBot = require('./bot.js');
const botName = "Glados";

console.log(`ComedyBOT loaded with ${Object.keys(comedyBot.questions).length} questions`);

/* Security issues has not been taken into consideration for this task. */

module.exports = (app, io) => {

	app.get(`/`, (req, res) => {
		res.sendfile('./public/index.html');
	});

	// Always holds the last question being asked
	var lastQuestion = null;

	io.on('connection', (socket) => {
		// Store the username for this connection
		var username = null;

		console.log("A user connected");

		socket.on('disconnect', () => {
			console.log("user disconnected")

			// Broadcast that a user got disconnected
			io.emit('message', {
				username: botName,
				message: `\"${username}\" has left the room!`,
				time: Date.now(),
				isAdmin: true
			});
		});

		socket.on('join_chat', (user) => {
			if (user) {
				username = user;

				// Broadcast that a user has joined
				io.emit('message', {
					username: botName,
					message: `\"${username}\" has joined the chat room!`,
					time: Date.now(),
					isAdmin: true
				});
			}
		});

		socket.on('message', (msg_entry) => {
			username = msg_entry.username;
			message = msg_entry.message;

			if (username && message) {
				msg_entry.time = Date.now();

				// Broadcast the message back to everyone
				io.emit('message', msg_entry);

				
				// If the last message was a question, save the answer for later
				if (lastQuestion != null) {
					comedyBot.addQuestion(lastQuestion, message);
					console.log("Question has been added to the ComedyBOT database!");
					lastQuestion = null;
				}
				// If our bot detects a question, read it and see if we need to add it to the database
				else if (message.endsWith("?")) {
					var botAnswer = comedyBot.getAnswer(message.toLowerCase());

					if (botAnswer) {
						// Answer for the question as it already exists in the database
						io.emit('message', {
							username: botName,
							message: `${botAnswer}`,
							time: Date.now(),
							isAdmin: true
						});
					}
					else {
						// If thats a new question we have detected, save it for later
						console.log("Detected a new question, saving it for later...");
						lastQuestion = message.toLowerCase(); // We don't mind about case sensitivity
					}

				}
			}
		});
	});
};