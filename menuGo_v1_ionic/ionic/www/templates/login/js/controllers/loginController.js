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
	const STATE_RESTAURANT_HOME = 'restaurant.home';
	
	var vm = this;
	
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
					{	reload: true	}
					);
				} else if(
						USER_ROLES.administrator == vm.user.role ||
						USER_ROLES.manager == vm.user.role ||
						USER_ROLES.cook == vm.user.role ||
						USER_ROLES.waiter == vm.user.role
						){
					$state.go(
							STATE_RESTAURANT_HOME, 
							{	companyName: vm.user.company_name	}, 
							{	reload: true	}
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