angular
.module('starter')
.controller('waiterController', waiterController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
waiterController.$inject = [
	'LOADING_MESSAGES', 
	'MQTT_CONFIG', 
	'$interval', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$scope', 
	'loginService', 
	'mqttService' 
];

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function waiterController(
		LOADING_MESSAGES, 
		MQTT_CONFIG, 
		$interval, 
		$ionicLoading, 
		$ionicPopup, 
		$scope, 
		loginService, 
		mqttService 
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.customerUsername = loginService.getUser().username;
	vm.interval = undefined;
	vm.callWaiterRequestsQueue = {};
	vm.callWaiterRequestsFIFO = [];
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.doContinuousLoop = doContinuousLoop;
	vm.doShowIonicPopup = doShowIonicPopup;
	vm.doShowIonicLoading = doShowIonicLoading;
	vm.doShowIonicLoadingCustom = vm.doShowIonicLoadingCustom;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	initialize();
	
	/* ******************************
	 * Method Implementation
	 * method name: reloadCustomerOrders()
	 * purpose: initializes MQTT & continuousLoop
	 * ****************************** */
	function initialize(){
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		var onConnectionLostCallback = function(responseError){
		}
		var onMessageArrivedCallback = function(response){
			$ionicLoading.hide();
			if(MQTT_CONFIG.topicWaiterRequest == response.destinationName){
				handleMessageArrivalWaiterRequest(response);
			} else if(MQTT_CONFIG.topicWaiterResponse == response.destinationName){
				handleMessageArrivalWaiterResponse(response);
			}
		}
		var onSuccessCallback = function(){
			$ionicLoading.hide();
			
			mqttService.setMqttTopic(MQTT_CONFIG.topicWaiterRequest);
			try{	mqttService.doSubscribe();
			} catch(err){		doShowIonicPopup(1, err);	}
			
			mqttService.setMqttTopic(MQTT_CONFIG.topicWaiterResponse);
			try{	mqttService.doSubscribe();
			} catch(err){		doShowIonicPopup(1, err);	}
			
			vm.interval = $interval(vm.doContinuousLoop, 2000);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		$ionicLoading.hide();
		mqttService.useDefaultConfig();
		try{
			doShowIonicLoading(LOADING_MESSAGES.doConnect);
			mqttService.doConnect(
					onConnectionLostCallback, 
					onMessageArrivedCallback, 
					onSuccessCallback
			);
		} catch(err){
			$ionicLoading.hide();
			doShowIonicPopup(1, err);
		}
		
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: handleMessageArrivalWaiterRequest()
	 * purpose: handles MQTT message w/topicWaiterRequest
	 * ****************************** */
	function handleMessageArrivalWaiterRequest(response){
		var msgBody = response.payloadString;
		msgBody = JSON.parse(msgBody);
		var customerUsername = msgBody.customer_username;
		var tableNumber = msgBody.table_number;
		var timestamp = msgBody.timestamp;
		if(null == vm.callWaiterRequestsQueue[customerUsername] || 
				undefined == vm.callWaiterRequestsQueue[customerUsername]){
			vm.callWaiterRequestsQueue[customerUsername] = msgBody;
			vm.callWaiterRequestsFIFO.push(customerUsername);
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: handleMessageArrivalWaiterResponse()
	 * purpose: handles MQTT message w/topicWaiterResponse
	 * ****************************** */
	function handleMessageArrivalWaiterResponse(response){
		var msgBody = response.payloadString;
		msgBody = JSON.parse(msgBody);
		var customerUsername = msgBody.customer_username;
		var tableNumber = msgBody.table_number;
		var timestamp = msgBody.timestamp;
		var respondingUser = msgBody.responding_user;
		
		var msgString = '';
		if(vm.customerUsername == respondingUser){
			msgString += 'YOU heed the call request of ' + customerUsername;
		} else {
			msgString += respondingUser + ' heed the call request of ' + customerUsername;
		}
		doShowIonicPopup(0, msgString);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doContinuousLoop()
	 * purpose: 
	 * ****************************** */
	function doContinuousLoop(){
		var callWaiterRequestsQueue = vm.callWaiterRequestsQueue;
		var callWaiterRequestsFIFO = vm.callWaiterRequestsFIFO;
		var callWaiterRequestsPop = callWaiterRequestsFIFO.pop();
		
		if(null == callWaiterRequestsPop){
			return;
		}
		
		var msgBody = callWaiterRequestsQueue[callWaiterRequestsPop];
		var customerUsername = msgBody.customer_username;
		var tableNumber = msgBody.table_number;
		var timestamp = msgBody.timestamp;
		
		/* ******************************
		 * Scope Isolation (Start)
		 * ****************************** */
		var doCallWaiterAckScope = $scope.$new(true);
		var doCallWaiterAckController = vm;
		
		doCallWaiterAckController.req = {};
		doCallWaiterAckController.req.customerUsername = customerUsername;
		doCallWaiterAckController.req.tableNumber = tableNumber;
		doCallWaiterAckController.req.timestamp = timestamp;
		
		doCallWaiterAckController.doCallWaiterAck = function(){
			var vm = doCallWaiterAckController;
			var mqttMessage = {};
			
			mqttMessage.customer_username = vm.req.customerUsername;
			mqttMessage.table_number = vm.req.tableNumber;
			mqttMessage.timestamp = vm.req.timestamp;
			mqttMessage.responding_user = vm.customerUsername;
			mqttMessage = JSON.stringify(mqttMessage);
			
			mqttService.setMqttTopic(MQTT_CONFIG.topicWaiterResponse);
			try{	mqttService.doSendMessage(mqttMessage);
			} catch(err){		doShowIonicPopup(1, err);	}
		}
		doCallWaiterAckScope.doCallWaiterAckController = doCallWaiterAckController;
		/* ******************************
		 * Scope Isolation (End)
		 * ****************************** */
		doShowIonicLoadingCustom(
				customerUsername, 
				tableNumber, 
				doCallWaiterAckScope
		);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doShowIonicPopup()
	 * purpose: show Ionic Popup
	 * ****************************** */
	function doShowIonicPopup(type, message){
		var title = '';
		var template = '';
		
		switch(type){
		case 0: //information
			title += 'Information';
			template += '<b>' + message + '</b>';
			break;
		case 1: //error
			title += 'Error';
			template += '<b>' + message + '</b>';
			break; 
		case 2: //response error
			title += 'Response Error';
			template += '<b>statusCode: ' + message.status + '<br>statusText: ' + message.statusText + '</b>'
			break;
		default: break;
		}
		$ionicPopup.alert({
			title: title, 
			template: template
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doShowIonicLoading()
	 * purpose: show Ionic Loading
	 * ****************************** */
	function doShowIonicLoading(message){
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner><p class="font-family-1-size-medium">' + message + '</p>'
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doShowIonicLoadingCustom()
	 * purpose: show ionic custom loading
	 * ****************************** */
	function doShowIonicLoadingCustom(
			customerUsername, 
			tableNumber, 
			doCallWaiterAckScope
	){
		var templateStr = '';
		templateStr += '<ion-spinner icon="spiral"></ion-spinner><p class="font-medium-style-1">';
		templateStr += customerUsername + ' @ table ' + tableNumber + ' is ' + LOADING_MESSAGES.doCallWaiter;
		templateStr += '</p><button class="button button-small button-positive font-small-style-1" ng-click="doCallWaiterAckController.doCallWaiterAck()">accept</button>';
		$ionicLoading.show({
			template: templateStr, 
			scope: doCallWaiterAckScope
		});
	}
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */