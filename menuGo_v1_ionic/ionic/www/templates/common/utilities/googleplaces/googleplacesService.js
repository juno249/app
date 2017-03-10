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
	const CONF_NEARBY_RADIUS = 5000;
	const CONF_NEARBY_TYPE = ['food'];
	
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
				deferred.reject(status);
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
				deferred.reject(status);
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
			companiesNames, 
			location, 
			domMapId
	){
		var deferred = $q.defer();
		var config = {
				location: location, 
				name: companiesNames, 
				radius: CONF_NEARBY_RADIUS, 
				type: CONF_NEARBY_TYPE
		}
		var mapInstance = undefined;
		var service = undefined;	
		
		NgMap.getMap({id: domMapId}).then(function(map){
			mapInstance = map;
			service = new google.maps.places.PlacesService(mapInstance);
			
			service.nearbySearch(
					config, 
					nearbySearchCallback
			);
		})
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function nearbySearchCallback(
				nearby, 
				status, 
				pagination
		){
			if(google.maps.places.PlacesServiceStatus.OK == status){
				deferred.resolve();
			} else {
				deferred.reject(status);
			}
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