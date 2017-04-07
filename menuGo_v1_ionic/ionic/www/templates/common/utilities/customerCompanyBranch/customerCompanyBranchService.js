angular
.module('starter')
.factory(
		'customerCompanyBranchService', 
		customerCompanyBranchService
		);

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
	const CUSTOMERS_COMPANIES_BRANCHES_KEY = 'CustomersCompaniesBranches';
	
	var customerCompanyBranchServiceObj = {
			customersCompaniesBranches: {}, 
			customerUsername: undefined, 
			companyName: undefined, 
			branchId: undefined, 
			getCustomersCompaniesBranches, 
			getCustomerUsername, 
			getCompanyName, 
			getBranchId, 
			setCustomersCompaniesBranches, 
			setCustomerUsername, 
			setCompanyName, 
			setBranchId, 
			getOptions: {
				1: 'getCustomersCompaniesBranches', 
				2: 'getCustomerCompanyBranch'
			}, 
			fetchCustomersCompaniesBranches: fetchCustomersCompaniesBranches, 
			addCustomerCompanyBranch: addCustomerCompanyBranch
			};
	
	function getCustomersCompaniesBranches(){	return customerCompanyBranchServiceObj.customersCompaniesBranches;
	}
	function getCustomerUsername(){	return customerCompanyBranchServiceObj.customerUsername;
	}
	function getCompanyName(){	return customerCompanyBranchServiceObj.companyName;
	}
	function getBranchId(){	return customerCompanyBranchServiceObj.branchId;
	}
	function setCustomersCompaniesBranches(customersCompaniesBranches){	customerCompanyBranchServiceObj.customersCompaniesBranches = customersCompaniesBranches;
	}
	function setCustomerUsername(customerUsername){	customerCompanyBranchServiceObj.customerUsername = customerUsername;
	}
	function setCompanyName(companyName){	customerCompanyBranchServiceObj.companyName = companyName;
	}
	function setBranchId(branchId){	customerCompanyBranchServiceObj.branchId = branchId;
	}
	
	function fetchCustomersCompaniesBranches(
			getOption, 
			getParams
			){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET'
				};
		
		switch(customerCompanyBranchServiceObj.getOptions[getOption]){
		case 'getCustomersCompaniesBranches':
			httpConfig['url'] = API_BASE_URL + '/customers-companies-branches';
			break;
		case 'getCustomerCompanyBranch':
			httpConfig['url'] = API_BASE_URL + '/customers-companies-branches/' + customerCompanyBranchServiceObj.customerUsername + '/' + customerCompanyBranchServiceObj.companyName + '/' + customerCompanyBranchServiceObj.branchId;
			break;
			default:
				break;
		}
		
		$http(httpConfig)
		.then(fetchCustomersCompaniesBranchesSuccessCallback)
		.catch(fetchCustomersCompaniesBranchesFailedCallback);
		
		function fetchCustomersCompaniesBranchesSuccessCallback(response){
			var customersCompaniesBranches = undefined;
			customerCompanyBranchServiceObj.customersCompaniesBranches = {};
			
			convertCustomersCompaniesBranchesResponseToMap(response.data);
			customersCompaniesBranches = customerCompanyBranchServiceObj.customersCompaniesBranches;
			customersCompaniesBranches = JSON.stringify(customersCompaniesBranches);
			localStorage.setItem(
					CUSTOMERS_COMPANIES_BRANCHES_KEY, 
					customersCompaniesBranches
					);
			
			deferred.resolve(response);
			}
		
		function fetchCustomersCompaniesBranchesFailedCallback(responseError){	deferred.reject(responseError);
		}
		
		function convertCustomersCompaniesBranchesResponseToMap(responseData){
			for(var i=0; i<responseData.length; i++){
				var customersCompaniesBranchesDetails = {};
				var key = undefined;
				
				for(var j=0; j<Object.keys(CUSTOMERCOMPANYBRANCH_DB_FIELDS).length; j++){	customersCompaniesBranchesDetails[CUSTOMERCOMPANYBRANCH_DB_FIELDS[j]] = responseData[i][CUSTOMERCOMPANYBRANCH_DB_FIELDS[j]];
				}
				
				var key = responseData[i][CUSTOMERCOMPANYBRANCH_DB_FIELDS[0]]; //customer_username
				customerCompanyBranchServiceObj.customersCompaniesBranches[key] = customersCompaniesBranchesDetails;
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
	
	return customerCompanyBranchServiceObj;
	}