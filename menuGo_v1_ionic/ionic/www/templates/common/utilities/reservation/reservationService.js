angular
.module('starter')
.factory('reservationService', reservationService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
reservationService.$inject = [
	'API_BASE_URL', 
	'RESERVATIONS_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function reservationService(
		API_BASE_URL, 
		RESERVATIONS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
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
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getReservations(){
		return reservationServiceObj.reservations;
	}
	function getReservation(){
		return reservationServiceObj.reservation;
	}
	function getReservationCode(){
		return reservationServiceObj.reservationCode;
	}
	function getCustomerUsername(){
		return reservationServiceObj.customerUsername;
	}
	function setReservations(reservations){
		reservationServiceObj.reservations = reservations;
	}
	function setReservation(reservation){
		reservationServiceObj.reservation = reservation;
	}
	function setReservationCode(reservationCode){
		reservationServiceObj.reservationCode = reservationCode;
	}
	function setCustomerUsername(customerUsername){
		reservationServiceObj.customerUsername = customerUsername;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchReservations()
	 * purpose: fetch reservations from server
	 * ****************************** */
	function fetchReservations(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations'
		}
		$http(httpConfig)
		.then(fetchReservationsSuccessCallback)
		.catch(fetchReservationsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchReservationsSuccessCallback(response){
			var reservations = reservationServiceObj.reservations;
			reservations = {};
			reservationServiceObj.reservations = reservations;
			
			convertReservationsResponseToMap(response.data);
			reservations = reservationServiceObj.reservations;
			reservations = JSON.stringify(reservations);
			localStorage.setItem('Reservations', reservations);
			
			deferred.resolve(response);
		}
		
		function fetchReservationsFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertReservationsResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertReservationsResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var reservationsKey = RESERVATIONS_DB_FIELDS[0]; //reservation_code
			var reservationsDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var reservationsRunner = responseData[i];
				var reservationsDBFieldCount = Object.keys(RESERVATIONS_DB_FIELDS).length;
				var reservationsDBFieldRunner = null;
				reservationsDetails = {};
				
				for(var j=0; j<reservationsDBFieldCount; j++){
					reservationsDBFieldRunner = RESERVATIONS_DB_FIELDS[j];
					reservationsDetails[reservationsDBFieldRunner] = reservationsRunner[reservationsDBFieldRunner];
				}
				var reservationsKeyValue = reservationsRunner[reservationsKey];
				reservationServiceObj.reservations[reservationsKeyValue] = reservationsDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchReservation()
	 * purpose: fetch reservation from server
	 * ****************************** */
	function fetchReservation(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/' + reservationServiceObj.reservationCode
		}
		$http(httpConfig)
		.then(fetchReservationSuccessCallback)
		.catch(fetchReservationFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchReservationSuccessCallback(response){
			var reservation = reservationServiceObj.reservation;
			reservation = {};
			reservationServiceObj.reservation = reservation;
			
			convertReservationResponseToMap(response.data);
			reservation = reservationServiceObj.reservation;
			reservation = JSON.stringify(reservation);
			localStorage.setItem('Reservation', reservation);
			
			deferred.resolve(response);
		}
		
		function fetchReservationFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertReservationResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertReservationResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var reservationKey = RESERVATIONS_DB_FIELDS[0]; //reservation_code
			var reservationDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var reservationRunner = responseData[i];
				var reservationDBFieldCount = Object.keys(RESERVATIONS_DB_FIELDS).length;
				var reservationDBFieldRunner = null;
				reservationDetails = {};
				
				for(var j=0; j<reservationDBFieldCount; j++){
					reservationDBFieldRunner = RESERVATIONS_DB_FIELDS[j];
					reservationDetails[reservationDBFieldRunner] = reservationRunner[reservationDBFieldRunner];
				}
				var reservationKeyValue = reservationRunner[reservationKey];
				reservationServiceObj.reservation[reservationKeyValue] = reservationDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addReservation()
	 * purpose: adds reservation
	 * ****************************** */
	function addReservation(reservations){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations', 
				data: reservations
		}
		$http(httpConfig)
		.then(addReservationSuccessCallback)
		.catch(addReservationFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addReservationSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addReservationFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateReservation()
	 * purpose: updates reservation
	 * ****************************** */
	function updateReservation(reservation){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/' + reservationServiceObj.reservationCode, 
				data: reservation
		}
		$http(httpConfig)
		.then(updateReservationSuccessCallback)
		.catch(updateReservationFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateReservationSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateReservationFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteReservation()
	 * purpose: deletes reservation
	 * ****************************** */
	function deleteReservation(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + reservationServiceObj.customerUsername + '/reservations/' + reservationServiceObj.reservationCode
		}
		$http(httpConfig)
		.then(deleteReservationSuccessCallback)
		.catch(deleteReservationFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteReservationSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteReservationFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return reservationServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */