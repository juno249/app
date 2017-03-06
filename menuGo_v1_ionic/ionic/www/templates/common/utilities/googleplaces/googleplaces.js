angular
.module('starter')
.factory('googleplacesService', googleplacesService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
googleplacesService.$inject = [
	'$q'
]
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function googleplacesService(
		$q
){
	const CONF_NEARBY_RADIUS = 1000;
	const CONF_NEARBY_TYPE = ['restaurant'];
	const ERR_MESSAGE = 'Error/Exception Encountered';
	
	var googleplacesServiceObj = {
			getPlacePredictions: getPlacePredictions, 
			getPlaceCoordinates: getPlaceCoordinates, 
			getPlacesNearby: getPlacesNearby
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getPlacePredictions()
	 * purpose: returns predictions based on query string
	 * ****************************** */
	function getPlacePredictions(query){
		var deferred = $q.defer();
		var config = {
				input: query
		}
		var service = new google.maps.places.AutocompleteService();
		
		service.getPlacePredictions(
				config, 
				getPlacePredictionsCallback
		);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getPlacePredictionsCallback(
				predictions, 
				status
		){
			if(google.maps.places.PlacesServiceStatus.OK == status){
				deferred.resolve(predicitions);
			} else {
				deferred.resolve([]) //return empty list
			}
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getPlaceCoordinates()
	 * purpose: returns (lat, long) based on placeId
	 * ****************************** */
	function getPlaceCoordinates(placeId){
		var deferred = $q.defer();
		var config = {
				placeId: placeId
		}
		var service = new google.maps.Geocoder;
		
		service.geocode(
				config, 
				geocodeCallback
		);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function geocodeCallback(
				coordinates, 
				status
		){
			if(google.maps.places.PlacesServiceStatus.OK == status){
				deferred.resolve(coordinates[0].geometry.location);
			} else {
				deferred.reject(ERR_MESSAGE);
			}
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: getPlacesNearby()
	 * purpose: returns nearby places
	 * ****************************** */
	function getPlacesNearby(location){
		var deferred = $q.defer();
		var config = {
				location: location, 
				radius: CONF_NEARBY_RADIUS, 
				type: CONF_NEARBY_TYPE
		}
		
		
		return deferred.promise;
	}
	
	return googleplacesServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */