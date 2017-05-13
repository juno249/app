angular
.module('starter')
.controller(
		'customerLaunchController', 
		customerLaunchController
		);

customerLaunchController.$inject = [
                                    'BROADCAST_MESSAGES', 
                                    'ERROR_MESSAGES', 
                                    'KEYS', 
                                    'LOADING_MESSAGES', 
                                    '$scope', 
                                    '$state', 
                                    '$stateParams', 
                                    'dataService', 
                                    'networkService', 
                                    'popupService'
                                    ];

function customerLaunchController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$scope, 
		$state, 
		$stateParams, 
		dataService, 
		networkService, 
		popupService
		){
	const STATE_CUSTOMER_QR = 'restaurant.customer-qr';
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	
	if(
			networkService.deviceIsOffline() &&
			!(null == localStorage.getItem(KEYS.Companies))
			){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		vm._company = vm.company[vm.companyName];
		} else if(
				networkService.deviceIsOffline() &&
				null == localStorage.getItem(KEYS.Companies)
				){
			vm.company = {};
			vm._company = {};
			} else {
				dataService.fetchCompanies();
				
				popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
				}
	
	//controller_method
	vm.gotoState = gotoState;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if(STATE_CUSTOMER_QR == stateName){
			$state.go(
					STATE_CUSTOMER_QR, 
					{	companyName: vm.user.company_name	}, 
					{	reload: true	}
					);
			}
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.Companies);
			}, 
			function(){
				vm.company = localStorage.getItem(KEYS.Companies);
				vm.company = JSON.parse(vm.company);
				}
			);
	
	$scope.$watch(
			function(){	return vm.company;
			}, 
			function(){
				if(!(null == vm.company)){	vm._company = vm._company = vm.company[vm.companyName];
				}
				}
			);
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
				vm.user = JSON.parse(vm.user);
				}
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompaniesSuccess, 
			function(){	popupService.hideIonicLoading();
			}
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompaniesFailed, 
			function(){
				var DOM_POPUP_CLASS = '.popup';
				
				popupService.hideIonicLoading();
				if(0 == $(DOM_POPUP_CLASS).length){	popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
				}
				}
			);
	}