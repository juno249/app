angular
.module('starter')
.controller('homeController', homeController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
homeController.$inject = [
	'LOADING_MESSAGES', 
	'MQTT_CONFIG', 
	'$ionicHistory', 
	'$ionicLoading', 
	'$localStorage', 
	'$rootScope', 
	'$timeout', 
	'loginService', 
	'mqttService' 
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function homeController(
		LOADING_MESSAGES, 
		MQTT_CONFIG, 
		$ionicHistory, 
		$ionicLoading, 
		$localStorage, 
		$rootScope, 
		$timeout, 
		loginService, 
		mqttService 
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var customer = localStorage.getItem('Customer');
	customer = JSON.parse(customer);
	customer = customer[loginService.getUser().username];
	vm.customer = customer;
	var table = localStorage.getItem('Table');
	table = JSON.parse(table);
	table = table[Object.keys(table)[0]];
	vm.table = table;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.broadcastEventMessage = broadcastEventMessage;
	vm.doCallWaiter = doCallWaiter;
	vm.doShowIonicPopup = doShowIonicPopup;
	vm.doShowIonicLoading = doShowIonicLoading;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	$ionicHistory.clearHistory();
	
	/* ******************************
	 * Method Implementation
	 * method name: broadcastEventMessage()
	 * purpose: broadcast an event message
	 * ****************************** */
	function broadcastEventMessage(eventMessage){
		var timeoutDelay = 100;
		$timeout(function(){ 
			$rootScope.$broadcast(eventMessage); 
			}, timeoutDelay);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doCallWaiter()
	 * purpose: sends an MQTT message to call waiter
	 * ****************************** */
	function doCallWaiter(){
		var mqttMessage = {};
		
		mqttMessage.customer_username = vm.customer.customer_username;
		mqttMessage.table_number = vm.table.table_number;
		mqttMessage.timestamp = new Date();
		mqttMessage = JSON.stringify(mqttMessage);
		mqttService.useDefaultConfig();
		
		mqttService.setMqttTopic(MQTT_CONFIG.topicWaiterResponse);
		try{ 	mqttService.doSubscribe();
		} catch (err){	doShowIonicPopup(1, err);	}
		
		mqttService.setMqttTopic(MQTT_CONFIG.topicWaiterRequest);
		try{	mqttService.doSendMessage(mqttMessage);
		} catch(err){		doShowIonicPopup(1, err);	}
		
		doShowIonicLoading(LOADING_MESSAGES.doCallWaiter);
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
}
/* ******************************
 * Controller Implementation (Start)
 * ****************************** */