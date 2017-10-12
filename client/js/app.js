// App
const app = angular.module('app', []);

// Service to fetch some data..
app.factory('apiService', ['$http',($http) => {
	return {
		get : ()=> $http.get('/data')
	}
}]);

app.factory('chatService', () => {
	chatMessages = [];

	return {
		chatMessages: chatMessages,
		addMessage: (username, msg, time, isAdmin=false) => {
			chatMessages.push(
				{ 
					username: username, 
					message: msg ,
					time: time,
					isAdmin: isAdmin
				}
			);
		}
	}
});

// App controller
app.controller('appController', ['$scope','apiService', 'chatService', ($scope, apiService, chatService) => {
	$scope.chatMessages = chatService.chatMessages;
	$scope.typedMessage = "";
	$scope.username = "";

	$scope.addAdminMessage = (msg) => {
		chatService.addMessage("ComedyBOT", msg, Date.now(), true);
	};

	$scope.onSendClick = (msg) => {
		if ($scope.typedMessage) {
			// If it's the first time the user enters, the first message is always the username
			if (!$scope.username) {
				$scope.username = $scope.typedMessage;
				$scope.addAdminMessage(`Hello there \"${$scope.username}\"! we are glad to have you here, you can now start the chat.`);
			}
			else {
				chatService.addMessage($scope.username, msg, Date.now());
			}

			$scope.typedMessage = "";
		}
	};

	$scope.onChatKeydown = (event) => {
		if (event.which == 13) $scope.onSendClick($scope.typedMessage);
	}

	apiService.get().success(resp => {
			$scope.funnyStuff = resp;
	});

	$scope.addAdminMessage("Hello there! in order to start please type in your username first.");
}]);