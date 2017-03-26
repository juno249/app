angular
.module('starter')
.factory(
		'mqttService', 
		mqttService
		);

mqttService.$inject = [
	'MQTT_CONFIG', 
	'loginService'
	];

function mqttService(
		MQTT_CONFIG, 
		loginService
		){
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
	
	function getMqttHost(){	return mqttServiceObj.mqttHost;
	}
	function getMqttPort(){	return mqttServiceObj.mqttPort;
	}
	function getMqttClientId(){	return mqttServiceObj.mqttClientId;
	}
	function getMqttTopic(){	return mqttServiceObj.mqttTopic;
	}
	function setMqttHost(mqttHost){		mqttServiceObj.mqttHost = mqttHost;
	} 
	function setMqttPort(mqttPort){	mqttServiceObj.mqttPort = mqttPort;
	}
	function setMqttClientId(mqttClientId){	mqttServiceObj.mqttClientId = mqttClientId;
	}
	function setMqttTopic(mqttTopic){	mqttServiceObj.mqttTopic = mqttTopic;
	}
	
	function useDefaultConfig(){
		var customerUsername = loginService.getUser().username;
		
		mqttServiceObj.setMqttHost(MQTT_CONFIG.host);
		mqttServiceObj.setMqttPort(MQTT_CONFIG.port);
		mqttServiceObj.setMqttClientId(customerUsername);
		}
	
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
	
	function doSubscribe(){	mqttServiceObj.mqttClient.subscribe(mqttServiceObj.mqttTopic);
	}

	function doUnsubscribe(){	mqttServiceObj.mqttClient.unsubscribe(mqttServiceObj.mqttTopic);
	}
	
	function doSendMessage(message){
		var mqttMessage = new Paho.MQTT.Message(message);
		
		mqttMessage.destinationName = mqttServiceObj.mqttTopic;
		mqttServiceObj.mqttClient.send(mqttMessage);
		}
	
	function doDisconnect(){	mqttServiceObj.mqttClient.disconnect();
	}
	
	return mqttServiceObj;
	}