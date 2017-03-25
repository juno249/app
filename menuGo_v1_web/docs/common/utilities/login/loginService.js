angular
.module('starter')
.factory('loginService', loginService);

loginService.$inject = [
	'API_BASE_URL', 
	'USER_ROLES', 
	'$http', 
	'$localStorage', 
	'$q' 
	];

function loginService(
		API_BASE_URL, 
		USER_ROLES, 
		$http, 
		$localStorage, 
		$q
		){
	var loginServiceObj = {
		loginUsername: undefined, 
		loginPassword: undefined, 
		user: {
			username: undefined, 
			token: undefined, 
			role: undefined, 
			name: undefined, 
			company: undefined, 
			branch: undefined, 
			isAuthenticated: undefined
		}, 
		getLoginUsername: getLoginUsername, 
		getLoginPassword: getLoginPassword, 
		getUser: getUser, 
		setLoginUsername: setLoginUsername, 
		setLoginPassword: setLoginPassword, 
		setUser: setUser, 
		doLogin: doLogin
	};
	
	function getLoginUsername(){	return loginServiceObj.loginUsername;
	}
	function getLoginPassword(){	return loginServiceObj.loginPassword;
	}
	function getUser(){	return loginServiceObj.user;
	}
	function setLoginUsername(loginUsername){	loginServiceObj.loginUsername = loginUsername;
	}
	function setLoginPassword(loginPassword){	loginServiceObj.loginPassword = loginPassword;
	}
	function setUser(user){	loginServiceObj.user = user;
	}
	
	function doLogin(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/login?customer_username=' + loginServiceObj.loginUsername + '&customer_password=' + loginServiceObj.loginPassword
		};
		
		$http(httpConfig)
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		function doLoginSuccessCallback(response){
			var userResponseData = response.data.User;
			
			loginServiceObj.user.username = userResponseData.customer_username;
			loginServiceObj.user.token = response.data.Token;
			loginServiceObj.user.role = userResponseData.customer_role;
			loginServiceObj.user.name = 
				userResponseData.customer_name_fname + " " + 
				userResponseData.customer_name_mname + ". " + 
				userResponseData.customer_name_lname
		
			$http.defaults.headers.common.Authorization = "bearer " + loginServiceObj.user.token;
			
			getCustomerCompanyBranch();
			
			function getCustomerCompanyBranch(){
				var httpConfig = {
						method: 'GET', 
						url: API_BASE_URL + '/customers-companies-branches/query', 
						params: {	customerUsername: loginServiceObj.user.username	}
				}
				
				$http(httpConfig)
				.then(getCustomerCompanyBranchSuccessCallback)
				.catch(getCustomerCompanyBranchFailedCallback);
				
				function getCustomerCompanyBranchSuccessCallback(response){
					var userResponseData = response.data;
					userResponseData = userResponseData[0];
					
					loginServiceObj.user.company = userResponseData.company_name;
					loginServiceObj.user.branch = userResponseData.branch_id;
					loginServiceObj.user.isAuthenticated = true;
					
					loginServiceObj.user = JSON.stringify(loginServiceObj.user);
					localStorage.setItem('User', loginServiceObj.user);
					
					deferred.resolve();
				}
				
				function getCustomerCompanyBranchFailedCallback(responseError){	deferred.reject(responseError);
				}
			}
		}
		
		function doLoginFailedCallback(responseError){	deferred.reject(responseError);
		}
		return deferred.promise;
	}
	
	return loginServiceObj;
}