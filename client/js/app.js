// App
const app = angular.module('app', ['btford.socket-io']);

// A simple service that stores all of the message
app.factory('chatService', () => {
	chatMessages = [];

	return {
		chatMessages: chatMessages,
		addJsonMessage: (msg) => chatMessages.push(msg),
		getJsonMessage: (username, msg) => {
			return { username: username, message: msg }
		},
		addMessage: (username, msg, time, isAdmin = false) => {
			chatMessages.push(
				{
					username: username,
					message: msg,
					time: time,
					isAdmin: isAdmin
				}
			);
		}
	}
});

// Allowes us to access the SocketIO api
app.factory('socketService', (socketFactory) => {
	return socketFactory();
});

// App controller
app.controller('appController', ['$scope', 'socketService', 'chatService', ($scope, socketService, chatService) => {
	// These variables are obtained from the user
	$scope.typedMessage = "";
	$scope.username = "";

	// The messages the message service is exposing
	$scope.chatMessages = chatService.chatMessages;

	$scope.addAdminMessage = (msg) => {
		chatService.addMessage("ComedyBOT", msg, Date.now(), true);
	};

	$scope.onSendClick = (msg) => {
		if ($scope.typedMessage) {
			// If it's the first time the user enters, the first message is always the username
			if (!$scope.username) {
				$scope.username = $scope.typedMessage;
				socketService.emit('join_chat', $scope.username);
			}
			else {
				socketService.emit('message', chatService.getJsonMessage($scope.username, $scope.typedMessage));
			}

			// Clear the previous input
			$scope.typedMessage = "";
		}
	};

	$scope.onChatKeydown = (event) => {
		// If user clicked on the enter key, send the message
		if (event.which == 13) $scope.onSendClick($scope.typedMessage);
	}

	// Connect using SocketIO
	socketService.connect();

	// Points the chat area so we can scroll to it's end
	var chatArea = document.querySelector("#chat_area");

	// We have obtained a chat message, post it using the chat service
	socketService.on('message', msg => {
		chatService.addJsonMessage(msg);

		// Scroll to the bottom always
		setTimeout(() => {
			chatArea.scrollTop = chatArea.scrollHeight;
		}, 100);
	});

	// Notify the user that he should enter his username
	$scope.addAdminMessage("Hello there! in order to start please type in your username first.");
}]);