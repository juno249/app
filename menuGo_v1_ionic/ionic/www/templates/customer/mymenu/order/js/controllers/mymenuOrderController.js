angular
.module('starter')
.controller(
		'mymenuOrderController', 
		mymenuOrderController
		);

mymenuOrderController.$inject = [
	'BROADCAST_MESSAGES', 
	'ERROR_MESSAGES', 
	'LOADING_MESSAGES', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$scope', 
	'dataService', 
	'reservationOrderreferenceOrderService'
	];

function mymenuOrderController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		LOADING_MESSAGES, 
		$ionicLoading, 
		$ionicPopup, 
		$scope, 
		dataService, 
		reservationOrderreferenceOrderService
		){
	const COMPANIES_KEY = 'Companies';
	const USER_KEY = 'User';
	
	var vm = this;
	vm.companyName = $scope.$parent.customerMymenuController.companyName;
	vm.branchName = $scope.$parent.customerMymenuController.branchName;
	vm.tableNumber = $scope.$parent.customerMymenuController.tableNumber;
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		}
	
	dispIonicLoading(LOADING_MESSAGES.gettingData);
	
	reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
	reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders()
	.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
	.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
	
	function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
		hideIonicLoading();
		
		vm.user.reservation = response.reservations;
		vm.user.orderreference = response.orderreferences;
		vm.user.orderreference.order = vm.user.orderreference.orders;
		delete vm.user.orderreference.orders;
		
		localStorage.setItem(
				USER_KEY, 
				JSON.stringify(vm.user)
				);
		
		if(!(null == localStorage.getItem(COMPANIES_KEY))){
			vm.companies = localStorage.getItem(COMPANIES_KEY);
			vm.companies = JSON.parse(vm.companies);
			} else {
				dataService.fetchCompanies();
				
				dispIonicLoading(LOADING_MESSAGES.gettingData);
				}
		}
	
	function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){
		hideIonicLoading();
		
		dispIonicPopup(ERROR_MESSAGES.getFailed);
		}
	
	function genCompanyMenuMenuitems(){
		var companyMenuMenuitems = {};
		
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					angular.forEach(
							v.menuitems, 
							function(
									v, 
									k
									){	companyMenuMenuitems[v.menuitem_id] = v;
									}
							);
					}
				);
		
		return companyMenuMenuitems;
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
			function(){	return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(){
				vm.companies = localStorage.getItem(COMPANIES_KEY);
				vm.companies = JSON.parse(vm.companies);
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.companies;
			}, 
			function(){
				if(!(null == vm.companies)){
					vm.company = vm.companies[vm.companyName];
					
					if(!(null == vm.company.branches)){
						vm.branch = vm.company.branches[vm.branchName];
						
						if(!(null == vm.branch.tables)){	vm.table = vm.branch.tables[vm.tableNumber];
						}
						}
					
					if(!(null == vm.company.menus)){	vm.companyMenus = vm.company.menus;
					}
					}
				
				vm.companyMenuMenuitems = genCompanyMenuMenuitems();
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
	}