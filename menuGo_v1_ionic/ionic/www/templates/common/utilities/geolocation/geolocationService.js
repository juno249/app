angular
.module('starter')
.factory('geolocationService', geolocationService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
geolocationService.$inject = [
	'$cordovaGeolocation', 
	'$q'
]
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
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
	}
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getGeolocationConfig(){
		return geolocationServiceObj.geolocationConfig;
	}
	
	function setGeolocationConfig(geolocationConfig){
		geolocationServiceObj.geolocationConfig = geolocationConfig;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	useThisConfig();
	
	/* ******************************
	 * Method Implementation
	 * method name: useThisConfig()
	 * purpose: use configuration defined
	 * ****************************** */
	function useThisConfig(){
		var geolocationConfig = {
				'timeout': CONF_TIMEOUT, 
				'enableHighAccuracy': CONF_ENABLE_HIGH_ACCURACY
		};
		
		geolocationServiceObj.setGeolocationConfig(geolocationConfig);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getPosition()
	 * purpose: gets current position
	 * ****************************** */
	function getPosition(){
		var deferred = $q.defer();
		var geolocationConfig = geolocationServiceObj.getGeolocationConfig();
		
		$cordovaGeolocation.getCurrentPosition(geolocationConfig)
		.then(getCurrentPositionSuccessCallback)
		.catch(getCurrentPositionFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getCurrentPositionSuccessCallback(position){
			var coords = {
				'latitude': position.coords.latitude, 
				'lognitude': position.coords.longitude
			}
			
			deferred.resolve(coords);
		}
		
		function getCurrentPositionFailedCallback(err){
			deferred.reject(err);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		return deferred.promise;
	}
	
	return geolocationServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */