const comedyBot = require('./bot.js');
const botName = "Glados";

console.log(`ComedyBOT loaded with ${Object.keys(comedyBot.questions).length} questions`);

/* Security issues has not been taken into consideration for this task. */

module.exports = (app, io) => {
	sendBotMessage = (message, delay = 0) => {
		setTimeout(() => {
			io.emit('message', {
				username: botName,
				message: message,
				time: Date.now(),
				isAdmin: true
			});
		}, delay);
	};

	// Send a random joke
	tellRandomJoke = (username) => {
		var rndJoke = comedyBot.getRandomJoke();
		sendBotMessage(`Hey ${username}, ${rndJoke.question}`, 2500);
		sendBotMessage(`${rndJoke.answer}`, 10000);
		sendBotMessage("hahahahahahhaah!!!! ^_^", 11000);
	}

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
			sendBotMessage(`\"${username}\" has left the room!`);
		});

		socket.on('join_chat', (user) => {
			if (user) {
				username = user;

				// Broadcast that a user has joined
				sendBotMessage(`\"${username}\" has joined the chat room!`);
				sendBotMessage(`You can type \"tell me a joke", and I will tell you a joke <3!`);
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
				// If the user asked for a joke
				else if (message.toLowerCase() == "tell me a joke") {
					sendBotMessage("Loading joke from hard-disk drive (hold on, we haven't moved to SSD's yet!)...");

					setTimeout(() => {
						tellRandomJoke(username);
					}, Math.random() * 10000);
				}
				// If the bot would like to tell one
				else if (comedyBot.givesAFuck()) {
					sendBotMessage("I'm feeling funny today...");
					setTimeout(() => {
						tellRandomJoke(username);
					}, 2000);
				}
			}
		});
	});
};