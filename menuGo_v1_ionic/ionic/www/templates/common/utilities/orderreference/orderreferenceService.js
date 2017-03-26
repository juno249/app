angular
.module('starter')
.factory(
		'orderreferenceService', 
		orderreferenceService
		);

orderreferenceService.$inject = [
	'API_BASE_URL', 
	'ORDERREFERENCES_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
	];

function orderreferenceService(
		API_BASE_URL, 
		ORDERREFERENCES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	const ORDERREFERENCES_KEY = 'Orderreferences';
	const ORDERREFERENCE_KEY = 'Orderreference';
	
	var orderreferenceServiceObj = {
			orderreferences: {}, 
			orderreference: {}, 
			orderreferenceCode: undefined, 
			customerUsername: undefined, 
			getOrderreferences: getOrderreferences, 
			getOrderreference: getOrderreference, 
			getOrderreferenceCode: getOrderreferenceCode, 
			getCustomerUsername: getCustomerUsername, 
			setOrderreferences: setOrderreferences, 
			setOrderreference: setOrderreference, 
			setOrderreferenceCode: setOrderreferenceCode, 
			setCustomerUsername: setCustomerUsername, 
			fetchOrderreferences: fetchOrderreferences, 
			fetchOrderreference: fetchOrderreference, 
			addOrderreference: addOrderreference, 
			updateOrderreference: updateOrderreference, 
			deleteOrderreference: deleteOrderreference
			}
	
	function getOrderreferences(){	return orderreferenceServiceObj.orderreferences;
	}
	function getOrderreference(){	return orderreferenceServiceObj.orderreference;
	}
	function getOrderreferenceCode(){	return orderreferenceServiceObj.orderreferenceCode;
	}
	function getCustomerUsername(){	return orderreferenceServiceObj.customerUsername;
	}
	function setOrderreferences(orderreferences){	orderreferenceServiceObj.orderreferences = orderreferences;
	}
	function setOrderreference(orderreference){	orderreferenceServiceObj.orderreference = orderreference;
	}
	function setOrderreferenceCode(orderreferenceCode){	orderreferenceServiceObj.orderreferenceCode = orderreferenceCode;
	}
	function setCustomerUsername(customerUsername){	orderreferenceServiceObj.customerUsername = customerUsername;
	}
	
	function fetchOrderreferences(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences'
				};
		
		$http(httpConfig)
		.then(fetchOrderreferencesSuccessCallback)
		.catch(fetchOrderreferencesFailedCallback);
		
		function fetchOrderreferencesSuccessCallback(response){
			var orderreferences = undefined;
			orderreferenceServiceObj.orderreferences = {};
			
			convertOrderreferencesResponseToMap(response.data);
			orderreferences = orderreferenceServiceObj.orderreferences;
			orderreferences = JSON.stringify(orderreferences);
			localStorage.setItem(
					ORDERREFERENCES_KEY, 
					orderreferences
					);
			
			deferred.resolve(response);
			}
		
		function fetchOrderreferencesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertOrderreferencesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var orderreferencesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(ORDERREFERENCES_DB_FIELDS).length; j++){	orderreferencesDetails[ORDERREFERENCES_DB_FIELDS[j]] = responseData[i][ORDERREFERENCES_DB_FIELDS[j]];
				}
				
				key = responseData[i][ORDERREFERENCES_DB_FIELDS[0]]; //orderreference_code
				orderreferenceServiceObj.orderreferences[key] = orderreferencesDetails;
				}
			}
		return deferred.promise;
		}
	
	function fetchOrderreference(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode
				};
		
		$http(httpConfig)
		.then(fetchOrderreferenceSuccessCallback)
		.catch(fetchOrderreferenceFailedCallback);
		
		function fetchOrderreferenceSuccessCallback(response){
			var orderreference = undefined;
			orderreferenceServiceObj.orderreference = {};
			
			convertOrderreferenceResponseToMap(response.data);
			orderreference = orderreferenceServiceObj.orderreference;
			orderreference = JSON.stringify(orderreference);
			localStorage.setItem(
					ORDERREFERENCE_KEY, 
					orderreference
					);
			
			deferred.resolve(response);
			}
		
		function fetchOrderreferenceFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertOrderreferenceResponseToMap(responseData){
			for (var i=0; i<responseData.length; i++){
				var orderreferenceDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(ORDERREFERENCES_DB_FIELDS).length; j++){	orderreferenceDetails[ORDERREFERENCES_DB_FIELDS[j]] = responseData[i][ORDERREFERENCES_DB_FIELDS[j]];
				}
				
				var key = responseData[i][ORDERREFERENCES_DB_FIELDS[0]]; //orderreference_code
				orderreferenceServiceObj.orderreference[key] = orderreferenceDetails;
				}
			}
		return deferred.promise;
		}
	
	function addOrderreference(orderreferences){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences', 
				data: orderreferences
				};
		
		$http(httpConfig)
		.then(addOrderreferenceSuccessCallback)
		.catch(addOrderreferenceFailedCallback);
		
		function addOrderreferenceSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addOrderreferenceFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function updateOrderreference(orderreference){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode, 
				data: orderreference
				};
		
		$http(httpConfig)
		.then(updateOrderreferenceSuccessCallback)
		.catch(updateOrderreferenceFailedCallback);
		
		function updateOrderreferenceSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateOrderreferenceFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteOrderreference(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode
				};
		
		$http(httpConfig)
		.then(deleteOrderreferenceSuccessCallback)
		.catch(deleteOrderreferenceFailedCallback);
		
		function deleteOrderreferenceSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteOrderreferenceFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return orderreferenceServiceObj;
	}