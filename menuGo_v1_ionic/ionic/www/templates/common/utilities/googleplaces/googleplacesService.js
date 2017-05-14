angular
.module('starter')
.factory(
		'googleplacesService', 
		googleplacesService
		);

googleplacesService.$inject = [
                               '$q', 
                               'NgMap'
                               ];

function googleplacesService(
		$q, 
		NgMap
		){
	const CONF_TYPE = ['food'];
	const CONF_RADAR_RADIUS = 10000;
	
	var googleplacesServiceObj = {
			getPlacePredictions: getPlacePredictions, 
			getPlaceCoordinates: getPlaceCoordinates, 
			getPlaceDetails: getPlaceDetails, 
			getPlacesNearby: getPlacesNearby, 
			getRadarSearch: getRadarSearch
			};
	
	function getPlacePredictions(query){
		var deferred = $q.defer();
		var config = {
				input: query, 
				componentRestrictions: {
					country: 'ph'
						}
		};
		var service = new google.maps.places.AutocompleteService();
		
		service.getPlacePredictions(
				config, 
				getPlacePredictionsCallback
				);
		
		function getPlacePredictionsCallback(
				predictions, 
				status
				){
			if(google.maps.places.PlacesServiceStatus.OK == status){	deferred.resolve(predictions);
			} else {	deferred.reject(status);
			}
			}
		return deferred.promise;
		}
	
	function getPlaceCoordinates(placeId){
		var deferred = $q.defer();
		var config = {	placeId: placeId	};
		var service = new google.maps.Geocoder;
		
		service.geocode(
				config, 
				geocodeCallback
				);
		
		function geocodeCallback(
				coordinates, 
				status
				){
			if(google.maps.places.PlacesServiceStatus.OK == status){	deferred.resolve(coordinates[0].geometry.location);
			} else {	deferred.reject(status);
			}
			}
		return deferred.promise;
		}
	
	function getPlaceDetails(
			placeId, 
			domMapId
			){
		var deferred = $q.defer();
		var config = {	placeId: placeId	};
		var mapInstance = undefined;
		var service = undefined;
		
		NgMap.getMap({id: domMapId})
		.then(
				function(map){
					mapInstance = map;
					service = new google.maps.places.PlacesService(mapInstance);
					service.getDetails(
							config, 
							getDetailsCallback
							);
					}
				);
		
		function getDetailsCallback(
				placeDetails, 
				status
				){
			if(google.maps.places.PlacesServiceStatus.OK == status){	deferred.resolve(placeDetails);
			} else {	deferred.reject(status);
			}
			}
		return deferred.promise;
		}
	
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
				};
		var mapInstance = undefined;
		var service = undefined;
		
		NgMap.getMap({id: domMapId})
		.then(
				function(map){
					mapInstance = map;
					service = new google.maps.places.PlacesService(mapInstance);
					
					service.nearbySearch(
							config, 
							nearbySearchCallback
							);
					}
				);
		
		function nearbySearchCallback(
				nearby, 
				status, 
				pagination
				){
			if(google.maps.places.PlacesServiceStatus.OK == status){	deferred.resolve(nearby);
			} else {	deferred.reject(status);
			}
			}
		return deferred.promise;
		}
	
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
				};
		var mapInstance = undefined;
		var service = undefined;
		
		NgMap.getMap({id: domMapId})
		.then(
				function(map){
					mapInstance = map;
					service = new google.maps.places.PlacesService(mapInstance);
					
					service.radarSearch(
							config, 
							radarSearchCallback
							);
					}
				);
		
		function radarSearchCallback(
				nearby, 
				status
				){
			if(google.maps.places.PlacesServiceStatus.OK == status){	deferred.resolve(nearby);
			} else {	deferred.reject(status);
			}
			}
		return deferred.promise;
		}
	
	return googleplacesServiceObj;
	}