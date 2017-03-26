angular
.module('starter')
.factory('reservationService', reservationService);

reservationService.$inject = [
	'API_BASE_URL', 
	'RESERVATIONS_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
	];

function reservationService(
		API_BASE_URL, 
		RESERVATIONS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	const RESERVATIONS_KEY = 'Reservations';
	const RESERVATION_KEY = 'Reservation';
	
	reservationServiceObj = {
			reservations: {}, 
			reservation: {}, 
			reservationCode: undefined, 
			customerUsername: undefined, 
			getReservations: getReservations, 
			getReservation: getReservation, 
			getReservationCode: getReservationCode, 
			getCustomerUsername: getCustomerUsername, 
			setReservations: setReservations, 
			setReservation: setReservation, 
			setReservationCode: setReservationCode, 
			setCustomerUsername: setCustomerUsername, 
			fetchReservations: fetchReservations, 
			fetchReservation: fetchReservation, 
			addReservation: addReservation, 
			updateReservation: updateReservation, 
			deleteReservation: deleteReservation
	}
	
	function getReservations(){	return reservationServiceObj.reservations;
	}
	function getReservation(){	return reservationServiceObj.reservation;
	}
	function getReservationCode(){	return reservationServiceObj.reservationCode;
	}
	function getCustomerUsername(){	return reservationServiceObj.customerUsername;
	}
	function setReservations(reservations){	reservationServiceObj.reservations = reservations;
	}
	function setReservation(reservation){	reservationServiceObj.reservation = reservation;
	}
	function setReservationCode(reservationCode){	reservationServiceObj.reservationCode = reservationCode;
	}
	function setCustomerUsername(customerUsername){	reservationServiceObj.customerUsername = customerUsername;
	}
	
	function fetchReservations(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations'
		};
		
		$http(httpConfig)
		.then(fetchReservationsSuccessCallback)
		.catch(fetchReservationsFailedCallback);
		
		function fetchReservationsSuccessCallback(response){
			var reservations = undefined;
			reservationServiceObj.reservations = {};
			
			convertReservationsResponseToMap(response.data);
			reservations = reservationServiceObj.reservations;
			reservations = JSON.stringify(reservations);
			localStorage.setItem(
					RESERVATIONS_KEY, 
					reservations
					);
			
			deferred.resolve(response);
		}
		
		function fetchReservationsFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertReservationsResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var reservationsDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(RESERVATIONS_DB_FIELDS).length; j++){
					reservationsDetails[RESERVATIONS_DB_FIELDS[j]] = responseData[i][RESERVATIONS_DB_FIELDS[j]];
				}
				
				var key = responseData[i][RESERVATIONS_DB_FIELDS[0]]; //reservation_code
				reservationServiceObj.reservations[key] = reservationsDetails;
			}
		}
		return deferred.promise;
	}
	
	function fetchReservation(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/' + reservationServiceObj.reservationCode
		};
		
		$http(httpConfig)
		.then(fetchReservationSuccessCallback)
		.catch(fetchReservationFailedCallback);
		
		function fetchReservationSuccessCallback(response){
			var reservation = undefined;
			reservationServiceObj.reservation = {};
			
			convertReservationResponseToMap(response.data);
			reservation = reservationServiceObj.reservation;
			reservation = JSON.stringify(reservation);
			localStorage.setItem(
					RESERVATION_KEY, 
					reservation
					);
			
			deferred.resolve(response);
		}
		
		function fetchReservationFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertReservationResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var reservationDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(RESERVATIONS_DB_FIELDS).length; j++){
					reservationDetails[RESERVATIONS_DB_FIELDS[j]] = responseData[i][RESERVATIONS_DB_FIELDS[j]];
				}
				
				key = responseData[i][RESERVATIONS_DB_FIELDS[0]]; //reservation_code
				reservationServiceObj.reservation[key] = reservationDetails;
			}
		}
		return deferred.promise;
	}
	
	function addReservation(reservations){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations', 
				data: reservations
		};
		
		$http(httpConfig)
		.then(addReservationSuccessCallback)
		.catch(addReservationFailedCallback);
		
		function addReservationSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addReservationFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function updateReservation(reservation){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/' + reservationServiceObj.reservationCode, 
				data: reservation
		};
		
		$http(httpConfig)
		.then(updateReservationSuccessCallback)
		.catch(updateReservationFailedCallback);
		
		function updateReservationSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateReservationFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	function deleteReservation(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/' + reservationServiceObj.reservationCode
		};
		
		$http(httpConfig)
		.then(deleteReservationSuccessCallback)
		.catch(deleteReservationFailedCallback);
		
		function deleteReservationSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteReservationFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return reservationServiceObj;
}