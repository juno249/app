angular
.module('starter')
.factory('reservationOrderreferenceOrderService', reservationOrderreferenceOrderService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
reservationOrderreferenceOrderService.$inject = [
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
function reservationOrderreferenceOrderService(
		$http, 
		$localStorage, 
		$q
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var reservationOrderreferenceOrderServiceObj = {
			addReservationOrderreferenceOrder: addReservationOrderreferenceOrder
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: addReservationOrderreferenceOrder()
	 * purpose: adds reservation, orderreference, order
	 * ****************************** */
	function addReservationOrderreferenceOrder(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/reservations-orderreferences-orders', 
				data: transParams
		}
		$http(httpConfig)
		.then(addReservationOrderreferenceOrderSuccessCallback)
		.catch(addReservationOrderreferenceOrderFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addReservationOrderreferenceOrderSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addReservationOrderreferenceOrderFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return reservationOrderreferenceOrderServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */