angular
.module('starter')
.factory('companiesService', companiesService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
companiesService.$inject = [
	'API_BASE_URL', 
	'COMPANIES_DB_FIELDS', 
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
function companiesService(
		API_BASE_URL, 
		COMPANIES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var companiesServiceObj = {
		companies: {}, 
		company: {}, 
		companyName: undefined, 
		getCompanies: getCompanies, 
		getCompany: getCompany,
		getCompanyName: getCompanyName, 
		setCompanies: setCompanies, 
		setCompany: setCompany,
		setCompanyName: setCompanyName, 
		fetchCompanies: fetchCompanies, 
		fetchCompany: fetchCompany, 
		addCompany: addCompany, 
		updateCompany: updateCompany, 
		deleteCompany: deleteCompany
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getCompanies(){
		return companiesServiceObj.companies;
	}
	function getCompany(){
		return companiesServiceObj.company;
	}
	function getCompanyName(){
		return companiesServiceObj.companyName;
	}
	function setCompanies(companies){
		companiesServiceObj.companies = companies;
	}
	function setCompany(company){
		companiesServiceObj.company = company;
	}
	function setCompanyName(companyName){
		companiesServiceObj.companyName = companyName;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCompanies()
	 * purpose: fetch companies from server
	 * ****************************** */
	function fetchCompanies(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies'
		};
		$http(httpConfig)
		.then(fetchCompaniesSuccessCallback)
		.catch(fetchCompaniesFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCompaniesSuccessCallback(response){
			companiesServiceObj.companies = {};
			convertCompaniesResponseToMap(response.data);
			var companies = companiesServiceObj.companies;
			companies = JSON.stringify(companies);
			localStorage.setItem('Companies', companies);
			deferred.resolve(response);
		}
		
		function fetchCompaniesFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertCompaniesResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertCompaniesResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var companiesKey = COMPANIES_DB_FIELDS[0]; //company_name
			var companiesDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var companiesRunner = responseData[i];
				var companiesDBFieldCount = Object.keys(COMPANIES_DB_FIELDS).length; 
				var companiesDBFieldRunner = null;
				companiesDetails = {};
				
				for(var j=0; j<companiesDBFieldCount; j++){
					companiesDBFieldRunner = COMPANIES_DB_FIELDS[j];
					companiesDetails[companiesDBFieldRunner] = companiesRunner[companiesDBFieldRunner];
				}
				var companiesKeyValue = companiesRunner[companiesKey];
				companiesServiceObj.companies[companiesKeyValue ] = companiesDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchCompany()
	 * purpose: fetch company from server
	 * ****************************** */
	function fetchCompany(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/companies/' + companiesServiceObj.companyName
		};
		$http(httpConfig)
		.then(fetchCompanySuccessCallback)
		.catch(fetchCompanyFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCompanySuccessCallback(response){
			companiesServiceObj.company = {};
			convertCompanyResponseToMap(response.data);
			var company = companiesServiceObj.company;
			company = JSON.stringify(company);
			localStorage.setItem('Company', company);
			deferred.resolve(response);
		}
		
		function fetchCompanyFailedCallback(responseError){
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
		function convertCompanyResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var companyKey = COMPANIES_DB_FIELDS[0]; //company_name;
			var companyDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var companyRunner = responseData[i];
				var companyDBFieldCount = Object.keys(COMPANIES_DB_FIELDS).length;
				var companyDBFieldRunner = null;
				companyDetails = {};
				
				for(var j=0; j<companyDBFieldCount; j++){
					companyDBFieldRunner = COMPANIES_DB_FIELDS[j];
					companyDetails[companyDBFieldRunner] = companyRunner[companyDBFieldRunner];
				}
				var companyKeyValue = companyRunner[companyKey];
				companiesServiceObj.company[companyKeyValue] = companyDetails;
			}
		}
		return deferred.promise;
	}

	/* ******************************
	 * Method Implementation
	 * method name: addCompany()
	 * purpose: adds company
	 * ****************************** */
	function addCompany(companies){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies', 
				data: companies
		};
		$http(httpConfig)
		.then(addCompanySuccessCallback)
		.catch(addCompanyFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addCompanySuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addCompanyFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateCompany()
	 * purpose: updates company
	 * ****************************** */
	function updateCompany(company){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + companiesServiceObj.companyName, 
				data: company
		};
		$http(httpConfig)
		.then(updateCompanySuccessCallback)
		.catch(updateCompanyFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateCompanySuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateCompanyFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteCompany()
	 * purpose: deletes company
	 * ****************************** */
	function deleteCompany(){
		var deferred = $q.defer();
		var httpConfig = {
				method: "DELETE", 
				url: API_BASE_URL + '/companies/' + companiesServiceObj.companyName
		}
		$http(httpConfig)
		.then(deleteCompanySuccessCallback)
		.catch(deleteCompanyFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteCompanySuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteCompanyFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return companiesServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */