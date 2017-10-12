const util = require('./response_util');

module.exports = (app,io) => {

	app.get(`/`, (req, res) => {
		res.sendfile('./public/index.html');
	});

	const funnyStuff = { question: `Why did the chicken cross the road?`, answer: `To get to the other side` };

	app.get(`/data`, (req, res) => {
		res.json(funnyStuff);
	});

	app.post('/join_chat', (req, res) => {
		const data = req.body;

		if (!data.username) return util.sendBadRequest(res);
		util.sendActionOk(res);
	});

	app.post('/leave_chat', (req, res) => {
		const data = req.body;

		if (!data.username) return util.sendBadRequest(res);
		util.sendActionOk(res);
	});

	app.post('/send_message', (req, res) => {
		const data = req.body;

		if (!data.username || !data.message) return util.sendBadRequest(res);
		util.sendActionOk(res);
	});

	io.on('connection', (socket) => {
		console.log("A user connected");

		socket.on('disconnect', () => {
			console.log("user disconnected");
		});

		socket.on('message', (msg) => {
			if (msg.username && msg.message) {
				msg.time = Date.now();
				socket.broadcast.emit(msg);
			}
		});
	});
};