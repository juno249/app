angular
.module('starter')
.controller(
		'mymenuBillController', 
		mymenuBillController
		);

mymenuBillController.$inject = [
	'BROADCAST_MESSAGES', 
	'ERROR_MESSAGES', 
	'LOADING_MESSAGES', 
	'ORDER_STATUS', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$scope', 
	'dataService', 
	'reservationOrderreferenceOrderService'
	];

function mymenuBillController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
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
		
		vm.user.reservation = response.reservation;
		vm.user.orderreference = response.orderreference;
		
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
	
	//controller_method
	vm.getTotalCost = getTotalCost;
	//controller_method
	vm.doBilloutCash = doBilloutCash;
	//controller_method
	vm.doBilloutCC = doBilloutCC;
	
	function getTotalCost(){
		var totalCost = 0;
		
		if(null == vm.user.orderreference){	return;
		}
		
		angular.forEach(
				vm.user.orderreference.order, 
				function(
						v, 
						k
						){	totalCost += v.cost;
						}
				);
		
		return totalCost;
		}
	
	function doBilloutCash(){
		if(!orderOrderstatusValid()){
		}
		}
	
	function doBilloutCC(){
		if(!orderOrderstatusValid()){
		}
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
	
	function appendQuantity(){
		var menuitemOrderId = {};
		
		if(!(null == vm.user.orderreference.order)){
			angular.forEach(
					vm.user.orderreference.order, 
					function(
							v, 
							k
							){
						if(!(null == menuitemOrderId[v.menuitem_id])){
							vm.user.orderreference.order[menuitemOrderId[v.menuitem_id]].quantity++;
							vm.user.orderreference.order[menuitemOrderId[v.menuitem_id]].cost += vm.companyMenuMenuitems[v.menuitem_id].menuitem_price;
							delete vm.user.orderreference.order[k];
							} else {
								vm.user.orderreference.order[k].quantity = 1;
								vm.user.orderreference.order[k].cost = vm.companyMenuMenuitems[v.menuitem_id].menuitem_price;
								menuitemOrderId[v.menuitem_id] = k;
								}
						}
					);
			}
		}
	
	function orderOrderstatusValid(){
		var isOrderOrderstatusValid = true;
		
		angular.forEach(
				vm.user.orderreference.order, 
				function(
						v, 
						k
						){
					if(!(ORDER_STATUS.to_serve == v.order_status)){	isOrderOrderstatusValid = false;
					}
					}
				);
		
		return isOrderOrderstatusValid;
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
	
	$scope.$watchCollection(
			function(){	return vm.user.orderreference;
			}, 
			function(){	appendQuantity();
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