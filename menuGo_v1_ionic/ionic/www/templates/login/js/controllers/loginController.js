angular
.module('starter')
.controller(
		'loginController', 
		loginController
		);

loginController.$inject = [
                           'ERROR_MESSAGES', 
                           'LOADING_MESSAGES', 
                           'USER_ROLES', 
                           '$ionicLoading', 
                           '$ionicPopup', 
                           '$localStorage', 
                           '$state', 
                           'loginService'
                           ];

function loginController(
		ERROR_MESSAGES, 
		LOADING_MESSAGES, 
		USER_ROLES, 
		$ionicLoading, 
		$ionicPopup, 
		$localStorage, 
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
	
	localStorage.clear();
	
	function doLogin(){
		loginService.setLoginUsername(vm.loginUsername);
		loginService.setLoginPassword(vm.loginPassword);
		
		loginService.doLogin()
		.then(doLoginSuccessCallback)
		.catch(doLoginFailedCallback);
		
		dispIonicLoading(LOADING_MESSAGES.authenticatingUser);
		
		function doLoginSuccessCallback(response){
			hideIonicLoading();
			
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
		
		function doLoginFailedCallback(responseError){
			hideIonicLoading();
			
			dispIonicPopup(ERROR_MESSAGES.authenticationFailed);
			}
		}
	
	function doSignup(){	
	}
	
	function dispIonicLoading(msg){
		var templateString = '';
		templateString += '<ion-spinner></ion-spinner><br>';
		templateString += "<span class='font-family-1-size-small'>" + msg + '</span>';
		
		$ionicLoading.show(
				{	template: templateString	}
				);
		}
	
	function hideIonicLoading(){	$ionicLoading.hide();
	}
	
	function dispIonicPopup(msg){
		var templateString = '';
		templateString += "<span class='font-family-1-size-small'>" + msg + '</span>';
		
		$ionicPopup.alert(
				{	template: templateString	}
				);
		}
	}