angular
.module('starter')
.controller(
		'customerNearbyController', 
		customerNearbyController
		);

customerNearbyController.$inject = [
                                    'BROADCAST_MESSAGES', 
                                    'ERROR_MESSAGES', 
                                    'KEYS', 
                                    'LOADING_MESSAGES', 
                                    '$ionicHistory', 
                                    '$ionicLoading', 
                                    '$ionicPopup', 
                                    '$ionicSlideBoxDelegate', 
                                    '$localStorage', 
                                    '$scope', 
                                    '$state', 
                                    '$timeout', 
                                    'branchService', 
                                    'dataService', 
                                    'googleplacesService'
                                    ];

function customerNearbyController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$ionicHistory, 
		$ionicLoading, 
		$ionicPopup, 
		$ionicSlideBoxDelegate, 
		$localStorage, 
		$scope, 
		$state, 
		$timeout, 
		branchService, 
		dataService, 
		googleplacesService
		){
	$ionicHistory.clearHistory();
	
	const DOM_COMPANY_SLIDEBOX_HANDLE = 'company-slidebox';
	
	var vm = this;
	vm.mapConfig = {
			center: {
				latitude: undefined, 
				longitude: undefined
				}, 
				mapTypeControl: false, 
				scaleControl: false, 
				streetViewControl: false, 
				zoom: 15, 
				zoomControl: false
				}
	
	if(!(null == localStorage.getItem(KEYS.Companies))){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		} else {
			dataService.fetchCompanies();
			
			dispIonicLoading(LOADING_MESSAGES.gettingData);
			}
	
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		}
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.setCompanyCategory = setCompanyCategory;
	//controller_method
	vm.toStringBranchAddress = toStringBranchAddress;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if('customer.nearby.reservation_menu' == stateName){
			$state.go(
					stateName, 
					{
						companyName: stateParams.companyName, 
						branchName: stateParams.branchName
						}, 
						{	reload: true	}
						);
			}
		}
	
	function setCompanyCategory(companyCategoryVal){	vm.companyCategoryVal = companyCategoryVal;
	}
	
	function toStringBranchAddress(branch){
		if(null == branch){	return;
		}
		
		branchService.setBranches(branch);
		
		return branchService.toStringAddress();
		}
	
	function genCompanyMenuMenuitem(){
		var companyMenuMenuitem = {};
		
		angular.forEach(
				vm.company, 
				function(
						v, 
						k
						){
					angular.forEach(
							v.menus, 
							function(
									j, 
									i
									){
								angular.forEach(
										j.menuitems, 
										function(
												j, 
												i
												){
											if(null == companyMenuMenuitem[k]){	companyMenuMenuitem[k] = {};
											}
											if(1 == j.menuitem_featured){	companyMenuMenuitem[k][j.menuitem_code] = j;
											}
											}
										);
								}
							);
					}
				);
		
		$timeout(
				function(){	$ionicSlideBoxDelegate.$getByHandle(DOM_COMPANY_SLIDEBOX_HANDLE).update();
				}
				);
		
		return companyMenuMenuitem;
		}
	
	function genCompanyCategory(){
		var companyCategory = [];
		
		angular.forEach(
				vm.company, 
				function(
						v, 
						k
						){
					var company = v;
					
					if(-1 == companyCategory.indexOf(v.company_category)){	companyCategory.push(v.company_category);
					}
					}
				);
		
		return companyCategory;
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
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.Companies);
			}, 
			function(){
				vm.company = localStorage.getItem(KEYS.Companies);
				vm.company = JSON.parse(vm.company);
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.company;
			}, 
			function(){
				vm.companyMenuMenuitem = genCompanyMenuMenuitem();
				vm.companyCategory = genCompanyCategory();
				}
			);
	
	$scope.$watch(
			function(){	return vm.search;
			}, 
			function(){
				if(
						null == vm.search ||
						0 == vm.search.trim().length
						){
					vm.placePrediction = undefined;
					return;
					}
				
				googleplacesService.getPlacePredictions(vm.search)
				.then(getPlacePredictionsSuccessCallback)
				.catch(getPlacePredictionsFailedCallback);
				
				function getPlacePredictionsSuccessCallback(predictions){		vm.placePrediction = predictions;
				}
				
				function getPlacePredictionsFailedCallback(status){	//do something on failure
				}
				}
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompaniesSuccess, 
			function(){	hideIonicLoading();
			}
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompaniesFailed, 
			function(){
				var DOM_POPUP_CLASS = '.popup';
				
				hideIonicLoading();
				if(0 == $(DOM_POPUP_CLASS).length){	dispIonicPopup(ERROR_MESSAGES.getFailed);
				}
				}
			);
	
	$scope.$on(
			'$ionicView.beforeEnter', 
			function(){
				if(!(null == vm.user)){
					vm.user.reservationOrder = {};
					
					localStorage.setItem(
							KEYS.User, 
							JSON.stringify(vm.user)
							);
					}
				}
			);
	}