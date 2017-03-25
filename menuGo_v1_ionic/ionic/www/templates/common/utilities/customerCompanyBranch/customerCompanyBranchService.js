angular
.module('starter')
.factory('customerCompanyBranchService', customerCompanyBranchService);

customerCompanyBranchService.$inject = [
	'API_BASE_URL', 
	'CUSTOMERCOMPANYBRANCH_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
	];

function customerCompanyBranchService(
		API_BASE_URL, 
		CUSTOMERCOMPANYBRANCH_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
		){
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
	};
	
	function getCustomersCompaniesBranches(){	return customerCompanyBranchServiceObj.customersCompaniesBranches;
	}
	function getCustomerCompanyBranch(){	return customerCompanyBranchServiceObj.customerCompanyBranch;
	}
	function getCustomerUsername(){	return customerCompanyBranchServiceObj.customerUsername;
	}
	function getCompanyName(){	return customerCompanyBranchServiceObj.companyName;
	}
	function getBranchName(){	return customerCompanyBranchServiceObj.branchName;
	}
	function setCustomersCompaniesBranches(customersCompaniesBranches){	customerCompanyBranchServiceObj.customersCompaniesBranches = customersCompaniesBranches;
	}
	function setCustomerCompanyBranch(customerCompanyBranch){	customerCompanyBranchServiceObj.customerCompanyBranch = customerCompanyBranch;
	}
	function setCustomerUsername(customerUsername){	customerCompanyBranchServiceObj.customerUsername = customerUsername;
	}
	function setCompanyName(companyName){	customerCompanyBranchServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){	customerCompanyBranchServiceObj.branchName = branchName;
	}
	
	function fetchCustomersCompaniesBranches(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers-companies-branches'
		};
		
		$http(httpConfig)
		.then(fetchCustomersCompaniesBranchesSuccessCallback)
		.catch(fetchCustomersCompaniesBranchesFailedCallback);
		
		function fetchCustomersCompaniesBranchesSuccessCallback(response){
			var customersCompaniesBranches = undefined;
			customerCompanyBranchServiceObj.customersCompaniesBranches = {};
			
			convertCustomersCompaniesBranchesResponseToMap(response.data);
			customersCompaniesBranches = customerCompanyBranchServiceObj.customersCompaniesBranches;
			customersCompaniesBranches = JSON.stringify(customersCompaniesBranches);
			localStorage.setItem('CustomersCompaniesBranches', customersCompaniesBranches);
			
			deferred.resolve(response);
		}
		function fetchCustomersCompaniesBranchesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertCustomersCompaniesBranchesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var customersCompaniesBranchesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(CUSTOMERCOMPANYBRANCH_DB_FIELDS).length; j++){
					customersCompaniesBranchesDetails[CUSTOMERCOMPANYBRANCH_DB_FIELDS[j]] = responseData[i][CUSTOMERCOMPANYBRANCH_DB_FIELDS[j]];
				}
				
				var key = responseData[i][CUSTOMERCOMPANYBRANCH_DB_FIELDS[0]]; //customer_username
				customerCompanyBranchServiceObj.customersCompaniesBranches[key] = customersCompaniesBranchesDetails;
			}
		}
		return deferred.promise;
	}
	
	function fetchCustomerCompanyBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/customers-companies-branches/' + customerCompanyBranchServiceObj.customerUsername + '/' + customerCompanyBranchServiceObj.companyName + '/' + customerCompanyBranchServiceObj.branchName
		};
		
		$http(httpConfig)
		.then(fetchCustomerCompanyBranchSuccessCallback)
		.catch(fetchCustomerCompanyBranchFailedCallback);
		
		function fetchCustomerCompanyBranchSuccessCallback(response){
			var customerCompanyBranch = undefined;
			customerCompanyBranchServiceObj.customerCompanyBranch = {};
			
			convertCustomerCompanyBranchResponseToMap(response.data);
			customerCompanyBranch = customerCompanyBranchServiceObj.customerCompanyBranch;
			customerCompanyBranch  = JSON.stringify(customerCompanyBranch);
			localStorage.setItem('CustomerCompanyBranch', customerCompanyBranch);
			
			deferred.resolve(response);
		}
		function fetchCustomerCompanyBranchFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertCustomerCompanyBranchResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var customerCompanyBranchDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(CUSTOMERCOMPANYBRANCH_DB_FIELDS).length; j++){
					customerCompanyBranchDetails[CUSTOMERCOMPANYBRANCH_DB_FIELDS[j]] = responseData[i][CUSTOMERCOMPANYBRANCH_DB_FIELDS[j]];	
				}
				
				var key = responseData[i][CUSTOMERCOMPANYBRANCH_DB_FIELDS[0]]; //customer_username
				customerCompanyBranchServiceObj.customerCompanyBranch[key] = customerCompanyBranchDetails;
			}
		}
		return deferred.promise;
	}
	
	function addCustomerCompanyBranch(transParams){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/customers-companies-branches', 
				data: transParams
		};
		
		$http(httpConfig)
		.then(addCustomerCompanyBranchTransactionSuccessCallback)
		.catch(addCustomerCompanyBranchTransactionFailedCallback);
		
		function addCustomerCompanyBranchTransactionSuccessCallback(response){	deferred.resolve(response);
		}
		
		function addCustomerCompanyBranchTransactionFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
		
	function deleteCustomerCompanyBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/customers-companies-branches/' + customerCompanyBranchServiceObj.customerUsername + '/' + customerCompanyBranchServiceObj.companyName + '/' + customerCompanyBranchServiceObj.branchName
		};
		
		$http(httpConfig)
		.then(deleteCustomerCompanyBranchSuccessCallback)
		.catch(deleteCustomerCompanyBranchFailedCallback);
		
		function deleteCustomerCompanyBranchSuccessCallback(response){	deferred.resolve(response);
		}
		
		function deleteCustomerCompanyBranchFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return customerCompanyBranchServiceObj;
}