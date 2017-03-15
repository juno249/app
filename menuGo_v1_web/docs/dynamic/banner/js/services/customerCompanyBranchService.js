angular
.module('starter')
.factory('customerCompanyBranchService', customerCompanyBranchService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
customerCompanyBranchService.$inject = [
	'API_BASE_URL', 
	'CUSTOMERCOMPANYBRANCH_DB_FIELDS', 
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
function customerCompanyBranchService(
		API_BASE_URL, 
		CUSTOMERCOMPANYBRANCH_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var customerCompanyBranchServiceObj = {
			customersCompaniesBranches: {}, 
			customerCompanyBranch: {}, 
			customerUsername: undefined, 
			companyName: undefined, 
			branchName: undefined, 
			getCustomersCompaniesBranches, 
			getCustomerCompanyBranch, 
			getCustomerUsername, 
			getCompanyName, 
			getBranchName, 
			setCustomersCompaniesBranches, 
			setCustomerCompanyBranch, 
			setCustomerUsername, 
			setCompanyName, 
			setBranchName, 
			fetchCustomersCompaniesBranches: fetchCustomersCompaniesBranches, 
			fetchCustomerCompanyBranch: fetchCustomerCompanyBranch, 
			addCustomerCompanyBranch: addCustomerCompanyBranch, 
			deleteCustomerCompanyBranch: deleteCustomerCompanyBranch
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getCustomersCompaniesBranches(){
		return customerCompanyBranchServiceObj.customersCompaniesBranches;
	}
	function getCustomerCompanyBranch(){
		return customerCompanyBranchServiceObj.customerCompanyBranch;
	}
	function getCustomerUsername(){
		return customerCompanyBranchServiceObj.customerUsername;
	}
	function getCompanyName(){
		return customerCompanyBranchServiceObj.companyName;
	}
	function getBranchName(){
		return customerCompanyBranchServiceObj.branchName;
	}
	function setCustomersCompaniesBranches(customersCompaniesBranches){
		customerCompanyBranchServiceObj.customersCompaniesBranches = customersCompaniesBranches;
	}
	function setCustomerCompanyBranch(customerCompanyBranch){
		customerCompanyBranchServiceObj.customerCompanyBranch = customerCompanyBranch;
	}
	function setCustomerUsername(customerUsername){
		customerCompanyBranchServiceObj.customerUsername = customerUsername;
	}
	function setCompanyName(companyName){
		customerCompanyBranchServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){
		customerCompanyBranchServiceObj.branchName = branchName;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCustomersBranchesCompanies()
	 * purpose: fetch customersCompaniesBranches from server
	 * ****************************** */
	function fetchCustomersCompaniesBranches(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers-companies-branches'
		};
		$http(httpConfig)
		.then(fetchCustomersCompaniesBranchesSuccessCallback)
		.catch(fetchCustomersCompaniesBranchesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCustomersCompaniesBranchesSuccessCallback(response){
			customerCompanyBranchServiceObj.customersCompaniesBranches = {};
			convertCustomersCompaniesBranchesResponseToMap(response.data);
			var customersCompaniesBranches = customerCompanyBranchServiceObj.customersCompaniesBranches;
			customersCompaniesBranches = JSON.stringify(customersCompaniesBranches);
			localStorage.setItem('CustomersCompaniesBranches', customersCompaniesBranches);
			deferred.resolve(response);
		}
		function fetchCustomersCompaniesBranchesFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertCustomersCompaniesBranchesResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertCustomersCompaniesBranchesResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var customersCompaniesBranchesKey = CUSTOMERCOMPANYBRANCH_DB_FIELDS[0] //customer_username
			var customersCompaniesBranchesDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var customersCompaniesBranchesRunner = responseData[i];
				var customersCompaniesBranchesFieldCount = Object.keys(CUSTOMERCOMPANYBRANCH_DB_FIELDS).length;
				var customersCompaniesDBFieldRunner = null;
				customersCompaniesBranchesDetails = {};
				
				for(var j=0; j<customersCompaniesBranchesFieldCount; j++){
					customersCompaniesDBFieldRunner = CUSTOMERCOMPANYBRANCH_DB_FIELDS[j];
					customersCompaniesBranchesDetails[customersCompaniesDBFieldRunner] = customersCompaniesBranchesRunner[customersCompaniesDBFieldRunner];
				}
				var customersCompaniesBranchesKeyValue = customersCompaniesBranchesRunner[customersCompaniesBranchesKey];
				customerCompanyBranchServiceObj.customersCompaniesBranches[customersCompaniesBranchesKeyValue] = customersCompaniesBranchesDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCustomerCompanyBranch()
	 * purpose: fetch customerCompanyBranch from server
	 * ****************************** */
	function fetchCustomerCompanyBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers-companies-branches/' + customerCompanyBranchServiceObj.customerUsername + '/' + customerCompanyBranchServiceObj.companyName + '/' + customerCompanyBranchServiceObj.branchName
		};
		$http(httpConfig)
		.then(fetchCustomerCompanyBranchSuccessCallback)
		.catch(fetchCustomerCompanyBranchFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCustomerCompanyBranchSuccessCallback(response){
			customerCompanyBranchServiceObj.customerCompanyBranch = {};
			convertCustomerCompanyBranchResponseToMap(response.data);
			var customerCompanyBranch = customerCompanyBranchServiceObj.customerCompanyBranch;
			customerCompanyBranch  = JSON.stringify(customerCompanyBranch);
			localStorage.setItem('CustomerCompanyBranch', customerCompanyBranch);
			deferred.resolve(response);
			
		}
		function fetchCustomerCompanyBranchFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertCustomerCompanyBranchResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertCustomerCompanyBranchResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var customerCompanyBranchKey = CUSTOMERCOMPANYBRANCH_DB_FIELDS[0]; //customer_username
			var customerCompanyBranchDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var customerCompanyBranchRunner = responseData[i];
				var customerCompanyBranchDBFieldCount = Object.keys(CUSTOMERCOMPANYBRANCH_DB_FIELDS).length;
				var customerCompanyBranchDBFieldRunner = null;
				customerCompanyBranchDetails = {};
				
				for(var j=0; j<customerCompanyBranchDBFieldCount; j++){
					customerCompanyBranchDBFieldRunner = CUSTOMERCOMPANYBRANCH_DB_FIELDS[j];
					customerCompanyBranchDetails[customerCompanyBranchDBFieldRunner] = customerCompanyBranchRunner[customerCompanyBranchDBFieldRunner];	
				}
				var customerCompanyBranchKeyValue = customerCompanyBranchRunner[customerCompanyBranchKey];
				customerCompanyBranchServiceObj.customerCompanyBranch[customerCompanyBranchKeyValue] = customerCompanyBranchDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addCustomerCompanyBranch()
	 * purpose: adds customer, company, branch & customerCompanyBranch
	 * ****************************** */
	function addCustomerCompanyBranch(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers-companies-branches-transaction', 
				data: transParams
		}
		$http(httpConfig)
		.then(addCustomerCompanyBranchTransactionSuccessCallback)
		.catch(addCustomerCompanyBranchTransactionFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addCustomerCompanyBranchTransactionSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addCustomerCompanyBranchTransactionFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementationsss (End)
		 * ****************************** */
		return deferred.promise;
	}
		
	/* ******************************
	 * Method Implementation
	 * method name: deleteCustomerCompanyBranch()
	 * purpose: deletes customerCompanyBranch
	 * ****************************** */
	function deleteCustomerCompanyBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers-companies-branches/' + customerCompanyBranchServiceObj.customerUsername + '/' + customerCompanyBranchServiceObj.companyName + '/' + customerCompanyBranchServiceObj.branchName
		}
		$http(httpConfig)
		.then(deleteCustomerCompanyBranchSuccessCallback)
		.catch(deleteCustomerCompanyBranchFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteCustomerCompanyBranchSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteCustomerCompanyBranchFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	return customerCompanyBranchServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */