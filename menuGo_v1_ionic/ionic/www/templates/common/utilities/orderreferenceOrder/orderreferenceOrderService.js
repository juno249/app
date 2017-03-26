angular
.module('starter')
.factory('orderreferenceOrderService', orderreferenceOrderService);

orderreferenceOrderService.$inject = [
	'$http', 
	'$q' 
	];

function orderreferenceOrderService(
		$http, 
		$q
		){
	var orderreferenceOrderServiceObj = {
			addOrderreferenceOrder: addOrderreferenceOrder
	}
	
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
		
		function addOrderreferenceOrderSuccessCallback(response){	deferred.promise(response);
		}
		
		function addOrderreferenceOrderFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return orderreferenceOrderServiceObj;
}