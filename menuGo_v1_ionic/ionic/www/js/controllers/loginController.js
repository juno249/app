angular
.module('starter')
.controller('loginController', loginController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
loginController.$inject = [
	'LOADING_MESSAGES', 
	'MQTT_CONFIG', 
	'USER_ROLES', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$localStorage', 
	'$state', 
	'customerService', 
	'loginService' 
]
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function loginController(
		LOADING_MESSAGES, 
		MQTT_CONFIG, 
		USER_ROLES, 
		$ionicLoading, 
		$ionicPopup, 
		$localStorage, 
		$state, 
		customerService, 
		loginService 
){		
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	vm.loginUsername = undefined;
	vm.loginPassword = undefined;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Methods (Start)
	 * ****************************** */
	vm.doLogin = doLogin;
	vm.doShowIonicPopup = doShowIonicPopup;
	vm.doShowIonicLoading = doShowIonicLoading;
	/* ******************************
	 * Controller Binded Methods (End)
	 * ****************************** */
	
	localStorage.clear();
	
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
		doShowIonicLoading(LOADING_MESSAGES.login)
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function doLoginSuccessCallback(response){
			$ionicLoading.hide();
			var loginUsername = vm.loginUsername;
			
			customerService.setCustomerUsername(loginUsername);
			customerService.fetchCustomer()
			.then(fetchCustomerSuccessCallback)
			.catch(fetchCustomerFailedCallback);
			doShowIonicLoading(LOADING_MESSAGES.fetchCustomer);
			
			/* ******************************
			 * Callback Implementations (Start)
			 * ****************************** */
			function fetchCustomerSuccessCallback(response){
				$ionicLoading.hide();
				var role = loginService.getUser().role;
				
				switch(role){
					case USER_ROLES.admin:
					case USER_ROLES.cook:
					case USER_ROLES.customer:
						$state.go('config', {}, {reload: true});
						break;	
					case USER_ROLES.waiter: 
						$state.go('waiter', {}, {reload: true});
						break;
					default: break;
				}
			}
			
			function fetchCustomerFailedCallback(responseError){
				$ionicLoading.hide();
				doShowIonicPopup(2, responseError);
			}
			/* ******************************
			 * Callback Implementations (End)
			 * ****************************** */
		}
		
		function doLoginFailedCallback(responseError){
			$ionicLoading.hide();
			doShowIonicPopup(2, responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doShowIonicPopup()
	 * purpose: show Ionic Popup
	 * ****************************** */
	function doShowIonicPopup(type, message){
		var title = '';
		var template = '';
		
		switch(type){
		case 0: //information
			title += 'Information';
			template += '<b>' + message + '</b>';
			break;
		case 1: //error
			title += 'Error';
			template += '<b>' + message + '</b>';
			break; 
		case 2: //response error
			title += 'Response Error';
			template += '<b>statusCode: ' + message.status + '<br>statusText: ' + message.statusText + '</b>'
			break;
		default: break;
		}
		$ionicPopup.alert({
			title: title, 
			template: template
		});
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: doShowIonicLoading()
	 * purpose: show Ionic Loading
	 * ****************************** */
	function doShowIonicLoading(message){
		$ionicLoading.show({
			template: '<ion-spinner icon="spiral"></ion-spinner><p class="font-family-1-size-medium">' + message + '</p>'
		});
	}
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */