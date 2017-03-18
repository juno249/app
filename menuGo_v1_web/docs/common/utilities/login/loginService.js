angular
.module('starter')
.factory('loginService', loginService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
loginService.$inject = [
	'API_BASE_URL', 
	'USER_ROLES', 
	'$http', 
	'$localStorage', 
	'$q' 
];
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */
function loginService(
		API_BASE_URL, 
		USER_ROLES, 
		$http, 
		$localStorage, 
		$q 
	){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var loginServiceObj = {
		loginUsername: undefined, 
		loginPassword: undefined, 
		user: {
			username: undefined, 
			token: undefined, 
			role: undefined, 
			name: undefined
		}, 
		getLoginUsername: getLoginUsername, 
		getLoginPassword: getLoginPassword, 
		getUser: getUser, 
		setLoginUsername: setLoginUsername, 
		setLoginPassword: setLoginPassword, 
		setUser: setUser, 
		doLogin: doLogin
	};
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getLoginUsername(){
		return loginServiceObj.loginUsername;
	}
	function getLoginPassword(){
		return loginServiceObj.loginPassword;
	}
	function getUser(){
		return loginServiceObj.user;
	}
	function setLoginUsername(loginUsername){
		loginServiceObj.loginUsername = loginUsername;
	}
	function setLoginPassword(loginPassword){
		loginServiceObj.loginPassword = loginPassword;
	}
	function setUser(user){
		loginServiceObj.user = user;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: doLogin()
	 * purpose: logs in and gets token from server
	 * ****************************** */
	function doLogin(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/login?customer_username=' + loginServiceObj.loginUsername + '&customer_password=' + loginServiceObj.loginPassword
		};
		$http(httpConfig)
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function doLoginSuccessCallback(response){
			var user = {};
			var userResponseData = response.data.User;
			
			user.username = userResponseData.customer_username;
			user.token = response.data.Token;
			user.role = userResponseData.customer_role;
			user.name = 
				userResponseData.customer_name_fname + " " + 
				userResponseData.customer_name_mname + ". " + 
				userResponseData.customer_name_lname
		
			$http.defaults.headers.common.Authorization = "bearer " + user.token;
			
			getCustomerCompanyBranch();
			
			/* ******************************
			 * Method Implementation
			 * method name: getCustomerCompanyBranch()
			 * purpose: logs in and gets token from server
			 * ****************************** */
			function getCustomerCompanyBranch(){
				var httpConfig = {
						method: 'GET', 
						url: API_BASE_URL + '/customers-companies-branches/query', 
						params: {customerUsername: user.username}
				}
				$http(httpConfig)
				.then(getCustomerCompanyBranchSuccessCallback)
				.catch(getCustomerCompanyBranchFailedCallback);
				
				/* ******************************
				 * Callback Implementations (Start)
				 * ****************************** */
				function getCustomerCompanyBranchSuccessCallback(response){
					var responseData = response.data;
					
					responseData = responseData[0];
					user.company = responseData.company_name;
					user.branch_id = responseData.branch_id;
					user.isAuthenticated = true;
					
					user = JSON.stringify(user);
					localStorage.setItem('User', user);
					deferred.resolve();
				}
				
				function getCustomerCompanyBranchFailedCallback(responseError){
					deferred.reject(responseError);
				}
				/* ******************************
				 * Callback Implementations (End)
				 * ****************************** */
			}
		}
		
		function doLoginFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return loginServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */