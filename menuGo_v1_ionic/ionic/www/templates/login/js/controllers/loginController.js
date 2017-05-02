angular
.module('starter')
.controller(
		'loginController', 
		loginController
		);

loginController.$inject = [
                           'ERROR_MESSAGES', 
                           'KEYS', 
                           'LOADING_MESSAGES', 
                           'USER_ROLES', 
                           '$localStorage', 
                           '$state', 
                           'loginService', 
                           'popupService'
                           ];

function loginController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		USER_ROLES, 
		$localStorage, 
		$state, 
		loginService, 
		popupService
		){
	const STATE_CUSTOMER_HOME = 'customer.home';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		vm.isAuthenticated = vm.user.isAuthenticated;
		}
	
	//controller_method
	vm.doLogin = doLogin;
	//controller_method
	vm.doSignup = doSignup;
	
	localStorage.clear();
	
	function doLogin(){
		loginService.setLoginUsername(vm.loginUsername);
		loginService.setLoginPassword(vm.loginPassword);
		
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		popupService.dispIonicLoading(LOADING_MESSAGES.authenticatingUser);
		
		function doLoginSuccessCallback(response){
			popupService.hideIonicLoading();
			
			vm.user = localStorage.getItem(KEYS.User);
			vm.user = JSON.parse(vm.user);
			
			if(USER_ROLES.customer == vm.user.role){
				$state.go(
					STATE_CUSTOMER_HOME, 
					{}, 
					{reload: true}
					);
				}
			}
		
		function doLoginFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.authenticationFailed);
			}
		}
	
	function doSignup(){
	}
	}