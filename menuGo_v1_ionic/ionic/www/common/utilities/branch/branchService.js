angular
.module('starter')
.factory('branchesService', branchesService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
branchesService.$inject = [
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
function branchesService(
		API_BASE_URL, 
		BRANCHES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var branchesServiceObj = {
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
			addBranch: addBranch, 
			updateBranch: updateBranch, 
			deleteBranch: deleteBranch
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getBranches(){
		return branchesServiceObj.branches;
	}
	function getBranch(){
		return branchesServiceObj.branch;
	}
	function getCompanyName(){
		return branchesServiceObj.companyName;
	}
	function getBranchName(){
		return branchesServiceObj.branchName;
	}
	function setBranches(branches){
		branchesServiceObj.branches = branches;
	}
	function setBranch(branch){
		branchesServiceObj.branch = branch;
	}
	function setCompanyName(companyName){
		branchesServiceObj.companyName = companyName;
	}
	function setBranchName(branchName){
		branchesServiceObj.branchName = branchName;
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
				url: API_BASE_URL + '/companies/' + branchesServiceObj.companyName + '/branches'
		};
		$http(httpConfig)
		.then(fetchBranchesSuccessCallback)
		.catch(fetchBranchesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBranchesSuccessCallback(response){
			branchesServiceObj.branches = {};
			convertBranchesResponseToMap(response.data);
			var branches = branchesServiceObj.branches;
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
				branchesServiceObj.branches[branchesKeyValue] = branchesDetails;
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
				url: API_BASE_URL + '/companies/' + branchesServiceObj.companyName + '/branches/' + branchesServiceObj.branchName
		};
		$http(httpConfig)
		.then(fetchBranchSuccessCallback)
		.catch(fetchBranchFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBranchSuccessCallback(response){
			branchesServiceObj.branch = {};
			convertBranchResponseToMap(response.data);
			var branch = branchesServiceObj.branch;
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
				branchesServiceObj.branch[branchKeyValue] = branchDetails;
			}
		}
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
				url: API_BASE_URL + '/companies/' + branchesServiceObj.companyName + '/branches', 
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
	 * method name: updateBranch()
	 * purpose: updates branch
	 * ****************************** */
	function updateBranch(branch){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + branchesServiceObj.companyName + '/branches/' + branchesServiceObj.branchName, 
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
	 * method name: updateBranch()
	 * purpose: deletes branch
	 * ****************************** */
	function deleteBranch(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + branchesServiceObj.companyName + '/branches/' + branchesServiceObj.branchName
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
	
	return branchesServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */