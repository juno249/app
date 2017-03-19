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
			customers: {}, 
			customer: {}, 
			customerUsername: undefined, 
			getCustomers: getCustomers, 
			getCustomer: getCustomer, 
			getCustomerUsername: getCustomerUsername, 
			setCustomers: setCustomers, 
			setCustomer: setCustomer, 
			setCustomerUsername: setCustomerUsername, 
			fetchCustomers: fetchCustomers, 
			fetchCustomer: fetchCustomer, 
			addCustomerValidate: addCustomerValidate, 
			addCustomer: addCustomer, 
			updateCustomerValidate: updateCustomerValidate, 
			updateCustomer: updateCustomer, 
			deleteCustomer: deleteCustomer
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getCustomers(){
		return customerServiceObj.customers;
	}
	function getCustomer(){
		return customerServiceObj.customer;
	}
	function getCustomerUsername(){
		return customerServiceObj.customerUsername;
	}
	function setCustomers(customers){
		customerServiceObj.customers = customers;
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
	 * method name: fetchCustomers()
	 * purpose: fetch customers from server
	 * ****************************** */
	function fetchCustomers(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers'
		}
		$http(httpConfig)
		.then(fetchCustomersSuccessCallback)
		.catch(fetchCustomersFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCustomersSuccessCallback(response){
			var customers = customerServiceObj.customers;
			customers = {};
			customerServiceObj.customers = customers;
			
			convertCustomersResponseToMap(response.data);
			customers = customerServiceObj.customers;
			customers = JSON.stringify(customers);
			localStorage.setItem('Customers', customers);
			
			deferred.resolve(response);
		}
		
		function fetchCustomersFailedCallback(responseError){
			return deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertCustomersResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertCustomersResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var customersKey = CUSTOMERS_DB_FIELDS[0]; //customer_username
			var customersDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var customersRunner = responseData[i];
				var customersDBFieldCount = Object.keys(CUSTOMERS_DB_FIELDS).length;
				var customersDBFieldRunner = null;
				customersDetails = {};
				
				for(var j=0; j<customersDBFieldCount; j++){
					customersDBFIeldRunner = CUSTOMERS_DB_FIELDS[j];
					customersDetails[customersDBFIeldRunner] = customersRunner[customersDBFIeldRunner];
				}
				var customersKeyValue = customersRunner[customersKey];
				customerServiceObj.customers[customersKeyValue] = customersDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCustomer()
	 * purpose: fetch customer from server
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
			var customer = customerServiceObj.customer;
			customer = {};
			customerServiceObj.customer = customer;
			
			convertCustomerResponseToMap(response.data);
			customer = customerServiceObj.customer;
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
		 * method name: convertCustomerResponseToMap()
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
	 * method name: addCustomerValidate()
	 * purpose: validates data for add
	 * ****************************** */
	function addCustomerValidate(customers){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/validate', 
				data: customers
		}
		$http(httpConfig)
		.then(addCustomerValidateSuccessCallback)
		.catch(addCustomerValidateFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addCustomerValidateSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addCustomerValidateFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addCustomer()
	 * purpose: adds customer
	 * ****************************** */
	function addCustomer(customers){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers', 
				data: customers
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
	 * method name: updateCustomerValidate()
	 * purpose: validates data for update
	 * ****************************** */
	function updateCustomerValidate(customer){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername + '/validate', 
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