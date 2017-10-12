// App
const app = angular.module('app', ['btford.socket-io']);

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

			$scope.typedMessage = "";
		}
	};

	$scope.onChatKeydown = (event) => {
		// If user clicked on the enter key, send the message
		if (event.which == 13) $scope.onSendClick($scope.typedMessage);
	}

	socketService.connect();
	socketService.on('message', msg => {
		chatService.addJsonMessage(msg);
	});

	$scope.addAdminMessage("Hello there! in order to start please type in your username first.");
}]);