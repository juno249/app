angular
.module('starter')
.controller('restaurantHomeController', restaurantHomeController);

restaurantHomeController.$inject = [
	'BROADCAST_MESSAGES', 
	'ERROR_MESSAGES', 
	'KEYS', 
	'LOADING_MESSAGES', 
	'$ionicHistory', 
	'$scope', 
	'$timeout', 
	'dataService', 
	'networkService', 
	'popupService'
	];

function restaurantHomeController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$ionicHistory, 
		$scope, 
		$timeout, 
		dataService, 
		networkService, 
		popupService
		){
	$ionicHistory.clearHistory();
	
	var vm = this;
	
	if(
			networkService.deviceIsOffline() &&
			!(null == localStorage.getItem(KEYS.Companies))
			){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
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
				if(!(null == vm.company)){	vm._company = vm._company = vm.company[vm.user.company_name];
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