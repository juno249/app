angular
.module('starter')
.factory(
		'geolocationService', 
		geolocationService
		);

geolocationService.$inject = [
                              '$cordovaGeolocation', 
                              '$q'
                              ];

function geolocationService(
		$cordovaGeolocation, 
		$q
		){
	const CONF_TIMEOUT = 10000;
	const CONF_ENABLE_HIGH_ACCURACY = false;
	
	var geolocationServiceObj = {
			geolocationConfig: undefined, 
			getGeolocationConfig: getGeolocationConfig, 
			setGeolocationConfig: setGeolocationConfig, 
			getPosition: getPosition
			};
	
	function getGeolocationConfig(){	return geolocationServiceObj.geolocationConfig;
	}
	
	function setGeolocationConfig(geolocationConfig){	geolocationServiceObj.geolocationConfig = geolocationConfig;
	}
	
	useThisConfig();
	
	function useThisConfig(){
		var geolocationConfig = {
				timeout: CONF_TIMEOUT, 
				enableHighAccuracy: CONF_ENABLE_HIGH_ACCURACY
				};
		
		geolocationServiceObj.setGeolocationConfig(geolocationConfig);
		}
	
	function getPosition(){
		var deferred = $q.defer();
		var geolocationConfig = geolocationServiceObj.getGeolocationConfig();
		
		$cordovaGeolocation.getCurrentPosition(geolocationConfig)
		.then(getCurrentPositionSuccessCallback)
		.catch(getCurrentPositionFailedCallback);
		
		function getCurrentPositionSuccessCallback(position){
			var coordinates = {
				latitude: position.coords.latitude, 
				longitude: position.coords.longitude
				};
			
			deferred.resolve(coordinates);
			}
		
		function getCurrentPositionFailedCallback(status){	deferred.reject(status);
		}
		return deferred.promise;
		}
	
	return geolocationServiceObj;
	}