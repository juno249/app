angular
.module('starter')
.controller('loginController', loginController);

loginController.$inject = [
	'USER_ROLES', 
	'$state', 
	'loginService'
	];

function loginController(
		USER_ROLES, 
		$state, 
		loginService
		){
	const STATE_CUSTOMER_HOME = 'customer.home';
	
	var vm = this;
	if(!(null == localStorage.getItem('User'))){
		vm.user = localStorage.getItem('User');
		vm.user = JSON.parse(vm.user);
		vm.isAuthenticated = vm.user.isAuthenticated;
	}
	
	//controller_method
	vm.doLogin = doLogin;
	//controller_method
	vm.doSignup = doSignup;
	
	function doLogin(){
		loginService.setLoginUsername(vm.loginUsername);
		loginService.setLoginPassword(vm.loginPassword);
		
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		function doLoginSuccessCallback(response){
			vm.user = localStorage.getItem('User');
			vm.user = JSON.parse(vm.user);
			
			if(USER_ROLES.customer == vm.user.role){
				$state.go(
					STATE_CUSTOMER_HOME, 
					{}, 
					{reload: true}
				);
			}
		}
		
		function doLoginFailedCallback(responseError){	//do something on failure
		}
	}
	
	function doSignup(){
	}
}