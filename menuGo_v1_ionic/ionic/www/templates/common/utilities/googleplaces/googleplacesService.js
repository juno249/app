angular
.module('starter')
.factory('googleplacesService', googleplacesService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
googleplacesService.$inject = [
	'$q', 
	'NgMap'
]
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function googleplacesService(
		$q, 
		NgMap
){
	const CONF_NEARBY_RADIUS = 100000;
	const CONF_NEARBY_TYPE = ['food'];
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
				deferred.resolve(predictions);
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
	function getPlacesNearby(
			location, 
			mapId
	){
		var deferred = $q.defer();
		var config = {
				location: location, 
				radius: CONF_NEARBY_RADIUS, 
				type: CONF_NEARBY_TYPE
		}
		var mapInstance = document.getElementById(mapId);
		var service = new google.maps.places.PlacesService(mapInstance);
		
		service.nearbySearch(
				config, 
				nearbySearchCallback
		);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function nearbySearchCallback(
				nearby, 
				status, 
				pagination
		){
			alert('success');
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		return deferred.promise;
	}
	
	return googleplacesServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */