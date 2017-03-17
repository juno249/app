angular
.module('starter')
.factory('branchService', branchService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
branchService.$inject = [
	'API_BASE_URL', 
	'BRANCHES_DB_FIELDS', 
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
function branchService(
		API_BASE_URL, 
		BRANCHES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var branchServiceObj = {
			branches: {}, 
			branch: {}, 
			companyName: undefined, 
			branchName: undefined, 
			getBranches: getBranches, 
			getBranch: getBranch, 
			getCompanyName: getCompanyName, 
			getBranchName: getBranchName, 
			setBranches: setBranches, 
			setBranch: setBranch, 
			setCompanyName: setCompanyName, 
			setBranchName: setBranchName, 
			fetchBranches: fetchBranches, 
			fetchBranch: fetchBranch, 
			addBranchValidate: addBranchValidate, 
			addBranch: addBranch, 
			updateBranchValidate: updateBranchValidate, 
			updateBranch: updateBranch, 
			deleteBranch: deleteBranch, 
			toStringAddress: toStringAddress
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getBranches(){
		return branchServiceObj.branches;
	}
	function getBranch(){
		return branchServiceObj.branch;
	}
	function getCompanyName(){
		return branchServiceObj.companyName;
	}
	function getBranchName(){
		return branchServiceObj.branchName;
	}
	function setBranches(branches){
		branchServiceObj.branches = branches;
	}
	function setBranch(branch){
		branchServiceObj.branch = branch;
	}
	function setCompanyName(companyName){
		branchServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){
		branchServiceObj.branchName = branchName;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchBranches()
	 * purpose: fetch branches from server
	 * ****************************** */
	function fetchBranches(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches'
		};
		$http(httpConfig)
		.then(fetchBranchesSuccessCallback)
		.catch(fetchBranchesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBranchesSuccessCallback(response){
			branchServiceObj.branches = {};
			convertBranchesResponseToMap(response.data);
			var branches = branchServiceObj.branches;
			branches = JSON.stringify(branches);
			localStorage.setItem('Branches', branches);
			deferred.resolve(response);
		}
		
		function fetchBranchesFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertBranchesResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertBranchesResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var branchesKey = BRANCHES_DB_FIELDS[1]; //branch_name
			var branchesDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var branchesRunner = responseData[i];
				var branchesDBFieldCount = Object.keys(BRANCHES_DB_FIELDS).length;
				var branchesDBFieldRunner = null; 
				branchesDetails = {};
				
				for(var j=0; j<branchesDBFieldCount; j++){
					branchesDBFieldRunner = BRANCHES_DB_FIELDS[j];
					branchesDetails[branchesDBFieldRunner] = branchesRunner[branchesDBFieldRunner];
				}
				var branchesKeyValue = branchesRunner[branchesKey];
				branchServiceObj.branches[branchesKeyValue] = branchesDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchBranch()
	 * purpose: fetch branch from server
	 * ****************************** */
	function fetchBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName
		};
		$http(httpConfig)
		.then(fetchBranchSuccessCallback)
		.catch(fetchBranchFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBranchSuccessCallback(response){
			branchServiceObj.branch = {};
			convertBranchResponseToMap(response.data);
			var branch = branchServiceObj.branch;
			branch = JSON.stringify(branch);
			localStorage.setItem('Branch', branch);
			deferred.resolve(response);
		}
		
		function fetchBranchFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertBranchResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertBranchResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var branchKey = BRANCHES_DB_FIELDS[1]; //branch_name
			var branchDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var branchRunner = responseData[i];
				var branchDBFieldCount = Object.keys(BRANCHES_DB_FIELDS).length;
				var branchDBFieldRunner = null;
				branchDetails = {};
				
				for(var j=0; j<branchDBFieldCount; j++){
					branchDBFieldRunner = BRANCHES_DB_FIELDS[j];
					branchDetails[branchDBFieldRunner] = branchRunner[branchDBFieldRunner];
				}
				var branchKeyValue = branchRunner[branchKey];
				branchServiceObj.branch[branchKeyValue] = branchDetails;
			}
		}
		return deferred.promise;
	}
		
	/* ******************************
	 * Method Implementation
	 * method name: addBranchValidate()
	 * purpose: validates data for add
	 * ****************************** */
	function addBranchValidate(branches){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches', 
				data: branches
		};
		$http(httpConfig)
		.then(addBranchValidateSuccessCallback)
		.catch(addBranchValidateFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addBranchValidateSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addBranchValidateFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addBranch()
	 * purpose: adds branch
	 * ****************************** */
	function addBranch(branches){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches', 
				data: branches
		}
		$http(httpConfig)
		.then(addBranchSuccessCallback)
		.catch(addBranchFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addBranchSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addBranchFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateBranchValidate()
	 * purpose: validates data for update
	 * ****************************** */
	function updateBranchValidate(branch){
		var deferred = $q.defer();
		var httpConfig =  {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName, 
				data: branch
		};
		$http(httpConfig)
		.then(updateBranchValidateSuccessCallback)
		.catch(updateBranchValidateFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateBranchValidateSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateBranchValidateFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateBranch()
	 * purpose: updates branch
	 * ****************************** */
	function updateBranch(branch){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName, 
				data: branch
		};
		$http(httpConfig)
		.then(updateBranchSuccessCallback)
		.catch(updateBranchFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateBranchSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateBranchFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteBranch()
	 * purpose: deletes branch
	 * ****************************** */
	function deleteBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + branchServiceObj.companyName + '/branches/' + branchServiceObj.branchName
		}
		$http(httpConfig)
		.then(deleteBranchSuccessCallback)
		.catch(deleteBranchFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteBranchSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteBranchFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: toStringAddress()
	 * purpose: returns an address string
	 * ****************************** */
	function toStringAddress(){
		var branch = branchServiceObj.branch;
		var newBranch = [];
		var newBranchString = '';
		var indexStart = 3;
		var indexEnd = 9;
		
		angular.forEach(BRANCHES_DB_FIELDS, function(v,k){
			if(!(k < 3 || k > 9)){
				newBranch[k-indexStart] = branch[BRANCHES_DB_FIELDS[k]];
			}
		});
		
		for(var i=0; i<newBranch.length; i++){
			newBranchString += newBranch[i];
			newBranchString += ', ';
		}
		
		newBranchString = newBranchString.substring(0, newBranchString.length-2);
		
		return newBranchString;
	}
	
	return branchServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */