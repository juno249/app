angular
.module('starter')
.factory('mqttService', mqttService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
mqttService.$inject = [
	'MQTT_CONFIG', 
	'loginService'
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function mqttService(
		MQTT_CONFIG, 
		loginService
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var mqttServiceObj = {
			mqttClient: undefined, 
			mqttHost: undefined, 
			mqttPort: undefined, 
			mqttClientId: undefined, 
			mqttTopic: undefined, 
			getMqttHost: getMqttHost, 
			getMqttPort: getMqttPort, 
			getMqttClientId: getMqttClientId, 
			getMqttTopic: getMqttTopic, 
			setMqttHost: setMqttHost, 
			setMqttPort: setMqttPort, 
			setMqttClientId: setMqttClientId, 
			setMqttTopic: setMqttTopic, 
			useDefaultConfig: useDefaultConfig, 
			doConnect: doConnect, 
			doSubscribe: doSubscribe, 
			doUnsubscribe: doUnsubscribe, 
			doSendMessage: doSendMessage, 
			doDisconnect: doDisconnect
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getMqttHost(){
		return mqttServiceObj.mqttHost;
	}
	function getMqttPort(){
		return mqttServiceObj.mqttPort;
	}
	function getMqttClientId(){
		return mqttServiceObj.mqttClientId;
	}
	function getMqttTopic(){
		return mqttServiceObj.mqttTopic;
	}
	function setMqttHost(mqttHost){	
		mqttServiceObj.mqttHost = mqttHost;
	} 
	function setMqttPort(mqttPort){
		mqttServiceObj.mqttPort = mqttPort;
	}
	function setMqttClientId(mqttClientId){
		mqttServiceObj.mqttClientId = mqttClientId;
	}
	function setMqttTopic(mqttTopic){
		mqttServiceObj.mqttTopic = mqttTopic;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: doConnect()
	 * purpose: configures MQTT based on pre-defined constants
	 * ****************************** */
	function useDefaultConfig(){
		mqttServiceObj.setMqttHost(MQTT_CONFIG.host);
		mqttServiceObj.setMqttPort(MQTT_CONFIG.port);
		var customerUsername = loginService.getUser().username;
		mqttServiceObj.setMqttClientId(customerUsername);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doConnect()
	 * purpose: connects to Mosca using Paho MQTT
	 * ****************************** */
	function doConnect(
			onConnectionLostCallback, 
			onMessageArrivedCallback, 
			onSuccessCallback
	){
		mqttServiceObj.mqttClient = new Paho.MQTT.Client(
			mqttServiceObj.mqttHost, 
			mqttServiceObj.mqttPort, 
			mqttServiceObj.mqttClientId
		);
		mqttServiceObj.mqttClient.onConnectionLost = onConnectionLostCallback;
		mqttServiceObj.mqttClient.onMessageArrived = onMessageArrivedCallback;
		mqttServiceObj.mqttClient.connect({onSuccess: onSuccessCallback});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doSubscribe()
	 * purpose: subscribes to an MQTT topic
	 * ****************************** */
	function doSubscribe(){
		mqttServiceObj.mqttClient.subscribe(mqttServiceObj.mqttTopic);
	}

	/* ******************************
	 * Method Implementation
	 * method name: doUnsubscribe()
	 * purpose: unsubscribes to an MQTT topic
	 * ****************************** */
	function doUnsubscribe(){
		mqttServiceObj.mqttClient.unsubscribe(mqttServiceObj.mqttTopic);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doSendMessage()
	 * purpose: sends an MQTT message
	 * ****************************** */
	function doSendMessage(message){
		var mqttMessage = new Paho.MQTT.Message(message);
		mqttMessage.destinationName = mqttServiceObj.mqttTopic;
		mqttServiceObj.mqttClient.send(mqttMessage);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doDisconnect()
	 * purpose: disconnects this MQTT client
	 * ****************************** */
	function doDisconnect(){
		mqttServiceObj.mqttClient.disconnect();
	}
	
	return mqttServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */