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
	const CONF_TYPE = ['food'];
	const CONF_RADAR_RADIUS = 5000;
	
	var googleplacesServiceObj = {
			getPlacePredictions: getPlacePredictions, 
			getPlaceCoordinates: getPlaceCoordinates, 
			getPlaceDetails: getPlaceDetails, 
			getPlacesNearby: getPlacesNearby, 
			getRadarSearch: getRadarSearch
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
	 * method name: getPlaceDetails()
	 * purpose: returns place details
	 * ****************************** */
	function getPlaceDetails(
			placeId, 
			domMapId
	){
		var deferred = $q.defer();
		var config = {
				placeId: placeId
		}
		
		NgMap.getMap({id: domMapId}).then(function(map){
			var mapInstance = map;
			service = new google.maps.places.PlacesService(mapInstance);
			
			service.getDetails(
					config, 
					getDetailsCallback
			);
		});
			
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function getDetailsCallback(
				placeDetails, 
				status
		){
			if(google.maps.places.PlacesServiceStatus.OK == status){
				deferred.resolve(placeDetails);
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
		var loc = new google.maps.LatLng(
				location.lat(), 
				location.lng()
		);
		var config = {
				location: loc, 
				name: companiesNames, 
				rankBy: google.maps.places.RankBy.DISTANCE, 
				type: CONF_TYPE
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
		});
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function nearbySearchCallback(
				nearby, 
				status, 
				pagination
		){
			if(google.maps.places.PlacesServiceStatus.OK == status){
				deferred.resolve(nearby);
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
	 * method name: getRadarSearch()
	 * purpose: returns nearby places
	 * ****************************** */
	function getRadarSearch(
			companiesNames, 
			location, 
			domMapId
	){
		var deferred = $q.defer();
		var loc = new google.maps.LatLng(
				location.lat(), 
				location.lng()
		);
		var config = {
				location: loc, 
				name: companiesNames, 
				radius: CONF_RADAR_RADIUS, 
				type: CONF_TYPE
		}
		var mapInstance = undefined;
		var service = undefined;
		
		NgMap.getMap({id: domMapId}).then(function(map){
			mapInstance = map;
			service = new google.maps.places.PlacesService(mapInstance);
			
			service.radarSearch(
					config, 
					radarSearchCallback
			);
		});
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function radarSearchCallback(
				nearby, 
				status
		){
			if(google.maps.places.PlacesServiceStatus.OK == status){
				deferred.resolve(nearby);
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