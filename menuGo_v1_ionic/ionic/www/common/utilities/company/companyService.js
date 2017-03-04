angular
.module('starter')
.factory('companyService', companyService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
companyService.$inject = [
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
function companyService(
		API_BASE_URL, 
		COMPANIES_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var companyServiceObj = {
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
		addCompanyValidate: addCompanyValidate, 
		addCompany: addCompany, 
		updateCompanyValidate: updateCompanyValidate, 
		updateCompany: updateCompany, 
		deleteCompany: deleteCompany, 
		uploadCompanyLogo: uploadCompanyLogo
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getCompanies(){
		return companyServiceObj.companies;
	}
	function getCompany(){
		return companyServiceObj.company;
	}
	function getCompanyName(){
		return companyServiceObj.companyName;
	}
	function setCompanies(companies){
		companyServiceObj.companies = companies;
	}
	function setCompany(company){
		companyServiceObj.company = company;
	}
	function setCompanyName(companyName){
		companyServiceObj.companyName = companyName;
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
			companyServiceObj.companies = {};
			convertCompaniesResponseToMap(response.data);
			var companies = companyServiceObj.companies;
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
				companyServiceObj.companies[companiesKeyValue ] = companiesDetails;
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
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName
		};
		$http(httpConfig)
		.then(fetchCompanySuccessCallback)
		.catch(fetchCompanyFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchCompanySuccessCallback(response){
			companyServiceObj.company = {};
			convertCompanyResponseToMap(response.data);
			var company = companyServiceObj.company;
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
				companyServiceObj.company[companyKeyValue] = companyDetails;
			}
		}
		return deferred.promise;
	}

	/* ******************************
	 * Method Implementation
	 * method name: addCompanyValidate()
	 * purpose: validates data for add
	 * ****************************** */
	function addCompanyValidate(companies){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/validate', 
				data: companies
		}
		$http(httpConfig)
		.then(addCompanyValidateSuccessCallback)
		.catch(addCompanyValidateFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addCompanyValidateSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addCompanyValidateFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
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
	 * method name: updateCompanyValidate()
	 * purpose: validates data for update
	 * ****************************** */
	function updateCompanyValidate(company){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName, 
				data: company
		}
		$http(httpConfig)
		.then(updateCompanyValidateSuccessCallback)
		.catch(updateCompanyValidateFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateCompanyValidateSuccessCallback(response){
			deferrred.resolve(response);
		}
		
		function updateCompanyValidateFailedCallback(responseError){
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
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName, 
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
				method: 'DELETE', 
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName
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
	
	/* ******************************
	 * Method Implementation
	 * method name: uploadCompanyLogo()
	 * purpose: uploads company logo
	 * ****************************** */
	function uploadCompanyLogo(imgFile){
		var httpFD = new FormData();
		httpFD.append('imgFile', imgFile);
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/companies/' + companyServiceObj.companyName + '/companyImage', 
				data: httpFD, 
				headers: {	'Content-Type': undefined	}
		}
		$http(httpConfig)
		.then(uploadCompanyLogoSuccessCallback)
		.catch(uploadCompanyLogoFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function uploadCompanyLogoSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function uploadCompanyLogoFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return companyServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */
