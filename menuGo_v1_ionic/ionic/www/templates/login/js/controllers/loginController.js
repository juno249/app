angular
.module('starter')
.controller('loginController', loginController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
loginController.$inject = [
	'USER_ROLES', 
	'$state', 
	'loginService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function loginController(
		USER_ROLES, 
		$state, 
		loginService
){
	/* ******************************
	 * Controller Implementation (Start)
	 * ****************************** */
	var vm = this;
	vm.user = undefined;
	if(!(null == localStorage.getItem('User'))){
		var user = localStorage.getItem('User');
		user = JSON.parse(user);
		vm.user = user;
		vm.isAuthenticated = user.isAuthenticated;
	} else {
		vm.loginUsername = undefined;
		vm.loginPassword = undefined;
		vm.isAuthenticated = undefined;
	}
	/* ******************************
	 * Controller Implementation (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.doLogin = doLogin;
	vm.doSignup = doSignup;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: doLogin()
	 * purpose: do login
	 * ****************************** */
	function doLogin(){
		var loginUsername = vm.loginUsername;
		var loginPassword = vm.loginPassword;
		
		loginService.setLoginUsername(loginUsername);
		loginService.setLoginPassword(loginPassword);
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function doLoginSuccessCallback(response){
			var user = localStorage.getItem('User');
			user = JSON.parse(user);
			
			if(USER_ROLES.customer == user.role){
				$state.go(
					'customer.home', 
					{}, 
					{reload: true}
				);
			}
		}
		
		function doLoginFailedCallback(responseError){
			//do something on failure
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doSignup()
	 * purpose: do signup
	 * ****************************** */
	function doSignup(){
	}
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */