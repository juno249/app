angular
.module('starter')
.factory('customerService', customerService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
customerService.$inject = [
	'API_BASE_URL', 
	'CUSTOMERS_DB_FIELDS', 
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
function customerService(
		API_BASE_URL, 
		CUSTOMERS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var customerServiceObj = {
			customer: {}, 
			customerUsername: undefined, 
			getCustomer: getCustomer, 
			getCustomerUsername: getCustomerUsername, 
			setCustomer: setCustomer, 
			setCustomerUsername: setCustomerUsername, 
			fetchCustomer: fetchCustomer, 
			addCustomer: addCustomer, 
			updateCustomer: updateCustomer, 
			deleteCustomer: deleteCustomer
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getCustomer(){
		return customerServiceObj.customer;
	}
	function getCustomerUsername(){
		return customerServiceObj.customerUsername;
	}
	function setCustomer(customer){
		customerServiceObj.customer = customer;
	}
	function setCustomerUsername(customerUsername){
		customerServiceObj.customerUsername = customerUsername;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCompanies()
	 * purpose: fetch companies from server
	 * ****************************** */
	function fetchCustomer(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername
		};
		$http(httpConfig)
		.then(fetchCustomerSuccessCallback)
		.catch(fetchCustomerFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCustomerSuccessCallback(response){
			customerServiceObj.customer = {};
			convertCustomerResponseToMap(response.data);
			var customer = customerServiceObj.customer;
			customer = JSON.stringify(customer);
			localStorage.setItem('Customer', customer);
			deferred.resolve(response);
		}
		
		function fetchCustomerFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertCompanyResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertCustomerResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var customerKey = CUSTOMERS_DB_FIELDS[0]; //customer_username
			var customerDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var customerRunner = responseData[i];
				var customerDBFieldCount = Object.keys(CUSTOMERS_DB_FIELDS).length;
				var customerDBFieldRunner = null;
				customerDetails = {};
				
				for(var j=0; j<customerDBFieldCount; j++){
					customerDBFieldRunner = CUSTOMERS_DB_FIELDS[j];
					customerDetails[customerDBFieldRunner] = customerRunner[customerDBFieldRunner];
				}
				var customerKeyValue = customerRunner[customerKey];
				customerServiceObj.customer[customerKeyValue] = customerDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addCustomer()
	 * purpose: adds customer
	 * ****************************** */
	function addCustomer(customer){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers', 
				data: customer
		}
		$http(httpConfig)
		.then(addCustomerSuccessCallback)
		.catch(addCustomerFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addCustomerSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addCustomerFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateCustomer()
	 * purpose: updates customer
	 * ****************************** */
	function updateCustomer(customer){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername, 
				data: customer
		};
		$http(httpConfig)
		.then(updateCustomerSuccessCallback)
		.catch(updateCustomerFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateCustomerSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateCustomerFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteCustomer()
	 * purpose: deletes customer
	 * ****************************** */
	function deleteCustomer(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername
		}
		$http(httpConfig)
		.then(deleteCustomerSuccessCallback)
		.catch(deleteCustomerFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteCustomerSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteCustomerFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return customerServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */