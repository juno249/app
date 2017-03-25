angular
.module('starter')
.factory('reservationOrderreferenceOrderService', reservationOrderreferenceOrderService);

reservationOrderreferenceOrderService.$inject = [
	'$http', 
	'$localStorage', 
	'$q' 
	];

function reservationOrderreferenceOrderService(
		$http, 
		$localStorage, 
		$q
		){
	var reservationOrderreferenceOrderServiceObj = {
			addReservationOrderreferenceOrder: addReservationOrderreferenceOrder
	}
	
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
		
		function addReservationOrderreferenceOrderSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addReservationOrderreferenceOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return reservationOrderreferenceOrderServiceObj;
}