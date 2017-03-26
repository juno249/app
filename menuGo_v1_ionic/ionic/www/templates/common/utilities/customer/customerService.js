angular
.module('starter')
.factory(
		'customerService', 
		customerService
		);

customerService.$inject = [
	'API_BASE_URL', 
	'CUSTOMERS_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
	];

function customerService(
		API_BASE_URL, 
		CUSTOMERS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
	const CUSTOMERS_KEY = 'Customers';
	const CUSTOMER_KEY = 'Customer';
	
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
	
	function getCustomers(){	return customerServiceObj.customers;
	}
	function getCustomer(){	return customerServiceObj.customer;
	}
	function getCustomerUsername(){	return customerServiceObj.customerUsername;
	}
	function setCustomers(customers){	customerServiceObj.customers = customers;
	}
	function setCustomer(customer){	customerServiceObj.customer = customer;
	}
	function setCustomerUsername(customerUsername){	customerServiceObj.customerUsername = customerUsername;
	}
	
	function fetchCustomers(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers'
				};
		
		$http(httpConfig)
		.then(fetchCustomersSuccessCallback)
		.catch(fetchCustomersFailedCallback);
		
		function fetchCustomersSuccessCallback(response){
			var customers = undefined;
			customerServiceObj.customers = {};
			
			convertCustomersResponseToMap(response.data);
			customers = customerServiceObj.customers;
			customers = JSON.stringify(customers);
			localStorage.setItem(
					CUSTOMERS_KEY, 
					customers
					);
			
			deferred.resolve(response);
			}
		
		function fetchCustomersFailedCallback(responseError){	return deferred.reject(responseError);
		}
		
		function convertCustomersResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var customersDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(CUSTOMERS_DB_FIELDS).length; j++){	customersDetails[CUSTOMERS_DB_FIELDS[j]] = responseData[i][CUSTOMERS_DB_FIELDS[j]];
				}
				
				key = responseData[i][CUSTOMERS_DB_FIELDS[0]]; //customer_username
				customerServiceObj.customers[key] = customersDetails;
				}
			}
		return deferred.promise;
		}
	
	function fetchCustomer(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername
				};
		
		$http(httpConfig)
		.then(fetchCustomerSuccessCallback)
		.catch(fetchCustomerFailedCallback);
		
		function fetchCustomerSuccessCallback(response){
			var customer = undefined;
			customerServiceObj.customer = {};
			
			convertCustomerResponseToMap(response.data);
			customer = customerServiceObj.customer;
			customer = JSON.stringify(customer);
			localStorage.setItem(
					CUSTOMER_KEY, 
					customer
					);
			
			deferred.resolve(response);
			}
		
		function fetchCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertCustomerResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var customerDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(CUSTOMERS_DB_FIELDS).length; j++){	customerDetails[CUSTOMERS_DB_FIELDS[j]] = responseData[i][CUSTOMERS_DB_FIELDS[j]];
				}
				
				key = responseData[i][CUSTOMERS_DB_FIELDS[0]]; //customer_username
				customerServiceObj.customer[key] = customerDetails;
				}
			}
		return deferred.promise;
		}
	
	function addCustomerValidate(customers){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers/validate', 
				data: customers
				};
		
		$http(httpConfig)
		.then(addCustomerValidateSuccessCallback)
		.catch(addCustomerValidateFailedCallback);
		
		function addCustomerValidateSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addCustomerValidateFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function addCustomer(customers){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers', 
				data: customers
				};
		
		$http(httpConfig)
		.then(addCustomerSuccessCallback)
		.catch(addCustomerFailedCallback);
		
		function addCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
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
		
		function updateCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
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
		
		function updateCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function updateCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	function deleteCustomer(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers/' + customerServiceObj.customerUsername
				};
		
		$http(httpConfig)
		.then(deleteCustomerSuccessCallback)
		.catch(deleteCustomerFailedCallback);
		
		function deleteCustomerSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteCustomerFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
		}
	
	return customerServiceObj;
	}