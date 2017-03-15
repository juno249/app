angular
.modue('starter')
.factory('orderreferenceService', orderreferenceService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
orderreferenceService.$inject = [
	'API_BASE_URL', 
	'ORDERREFERENCES_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
]
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function orderreferenceService(
		API_BASE_URL, 
		ORDERREFERENCES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
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
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getOrderreferences(){
		return orderreferenceServiceObj.orderreferences;
	}
	function getOrderreference(){
		return orderreferenceServiceObj.orderreference;
	}
	function getOrderreferenceCode(){
		return orderreferenceServiceObj.orderreferenceCode;
	}
	function getCustomerUsername(){
		return orderreferenceServiceObj.customerUsername;
	}
	function setOrderreferences(orderreferences){
		orderreferenceServiceObj.orderreferences = orderreferences;
	}
	function setOrderreference(orderreference){
		orderreferenceServiceObj.orderreference = orderreference;
	}
	function setOrderreferenceCode(orderreferenceCode){
		orderreferenceServiceObj.orderreferenceCode = orderreferenceCode;
	}
	function setCustomerUsername(customerUsername){
		orderreferenceServiceObj.customerUsername = customerUsername;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchOrderreferences()
	 * purpose: fetch orderreferences from server
	 * ****************************** */
	function fetchOrderreferences(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences'
		}
		$http(httpConfig)
		.then(fetchOrderreferencesSuccessCallback)
		.catch(fetchOrderreferencesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchOrderreferencesSuccessCallback(response){
			orderreferenceServiceObj.orderreferences = {};
			convertOrderreferencesResponseToMap(response.data);
			var orderreferences = orderreferenceServiceObj.orderreferences;
			orderreferences = JSON.stringify(orderreferences);
			localStorage.setItem('Orderreferences', orderreferences);
			deferred.resolve(response);
		}
		
		function fetchOrderreferencesFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertOrderreferencesResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertOrderreferencesResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var orderreferencesKey = ORDERREFERENCES_DB_FIELDS[0]; //orderreference_code
			var orderreferencesDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var orderreferencesRunner = responseData[i];
				var orderreferencesDBFieldCount = Object.keys(ORDERREFERENCES_DB_FIELDS).length;
				var orderreferencesDBFieldRunner = null;
				orderreferencesDetails = {};
				
				for(var j=0; j<orderreferencesDBFieldCount; j++){
					orderreferencesDBFieldRunner = ORDERREFERENCES_DB_FIELDS[j];
					orderreferencesDetails[orderreferencesDBFieldRunner] = orderreferencesRunner[orderreferencesDBFieldRunner];
				}
				var orderreferencesKeyValue = orderreferencesRunner[orderreferencesKey];
				orderreferenceServiceObj.orderreferences[orderreferencesKeyValue] = orderreferencesDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchOrderreference()
	 * purpose: fetch orderreference from server
	 * ****************************** */
	function fetchOrderreference(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode
		}
		$http(httpConfig)
		.then(fetchOrderreferenceSuccessCallback)
		.catch(fetchOrderreferenceFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchOrderreferenceSuccessCallback(response){
			orderreferenceServiceObj.orderreference = {};
			convertOrderreferenceResponseToMap(response.data);
			var orderreference = orderreferenceServiceObj.orderreference;
			orderreference = JSON.stringify(orderreference);
			localStorage.setItem('Orderreference', orderreference);
			deferred.resolve(response);
		}
		
		function fetchOrderreferenceFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertOrderreferenceResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertOrderreferenceResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var orderreferenceKey = ORDERREFERENCES_DB_FIELDS[0]; //orderreference_code
			var orderreferenceDetails;
			
			for (var i=0; i<responseDataLength; i++){
				var orderreferenceRunner = responseData[i];
				var orderreferenceDBFieldCount = Object.keys(ORDERREFERENCES_DB_FIELDS).length;
				var orderreferenceDBFieldRunner = null;
				orderreferenceDetails = {};
				
				for(var j=0; j<orderreferenceDBFieldCount; j++){
					orderreferenceDBFieldRunner = ORDERREFERENCES_DB_FIELDS[j];
					orderreferenceDetails[orderreferenceDBFieldRunner] = orderreferenceRunner[orderreferenceDBFieldRunner];
				}
				var orderreferenceKeyValue = orderreferenceRunner[orderreferenceKey];
				orderreferenceServiceObj.orderreference[orderreferenceKeyValue] = orderreferenceDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addOrderreference()
	 * purpose: adds orderreference
	 * ****************************** */
	function addOrderreference(orderreferences){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences', 
				data: orderreferences
		}
		$http(httpConfig)
		.then(addOrderreferenceSuccessCallback)
		.catch(addOrderreferenceFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addOrderreferenceSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addOrderreferenceFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateOrderreference()
	 * purpose: updates orderreference
	 * ****************************** */
	function updateOrderreference(orderreference){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode, 
				data: orderreference
		}
		$http(httpConfig)
		.then(updateOrderreferenceSuccessCallback)
		.catch(updateOrderreferenceFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateOrderreferenceSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateOrderreferenceFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteOrderreference()
	 * purpose: deletes orderreference
	 * ****************************** */
	function deleteOrderreference(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + orderreferenceServiceObj.customerUsername + '/orderreferences/' + orderreferenceServiceObj.orderreferenceCode
		}
		$http(httpConfig)
		.then(deleteOrderreferenceSuccessCallback)
		.catch(deleteOrderreferenceFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteOrderreferenceSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteOrderreferenceFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return orderreferenceServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */