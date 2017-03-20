angular
.module('starter')
.factory('orderreferenceOrderService', orderreferenceOrderService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
orderreferenceOrderService.$inject = [
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
function orderreferenceOrderService(
		$http, 
		$localStorage, 
		$q
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var orderreferenceOrderService = {
			addOrderreferenceOrder: addOrderreferenceOrder
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: addOrderreferenceOrder()
	 * purpose: adds orderreference, order
	 * ****************************** */
	function addOrderreferenceOrder(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/orderreferences-orders', 
				data: transParams
		}
		$http(httpConfig)
		.then(addOrderreferenceOrderSuccessCallback)
		.catch(addOrderreferenceOrderFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addOrderreferenceOrderSuccessCallback(response){
			deferred.promise(response);
		}
		
		function addOrderreferenceOrderFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return orderreferenceOrderService;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */