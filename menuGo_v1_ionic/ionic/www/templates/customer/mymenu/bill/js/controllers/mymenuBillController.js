angular
.module('starter')
.controller(
		'mymenuBillController', 
		mymenuBillController
		);

mymenuBillController.$inject = [
	'BROADCAST_MESSAGES', 
	'ERROR_MESSAGES', 
	'KEYS', 
	'LOADING_MESSAGES', 
	'ORDER_STATUS', 
	'$scope', 
	'dataService', 
	'networkService', 
	'popupService', 
	'reservationOrderreferenceOrderService'
	];

function mymenuBillController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		$scope, 
		dataService, 
		networkService, 
		popupService, 
		reservationOrderreferenceOrderService
		){
	var vm = this;
	vm.companyName = $scope.$parent.customerMymenuController.companyName;
	vm.branchName = $scope.$parent.customerMymenuController.branchName;
	vm.tableNumber = $scope.$parent.customerMymenuController.tableNumber;
	
	//controller_method
	vm.getTotalCost = getTotalCost;
	//controller_method
	vm.doBilloutCash = doBilloutCash;
	//controller_method
	vm.doBilloutCC = doBilloutCC;
	
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
			vm.companyMenu = {};
			vm.companyMenuMenuitem = {};
			} else {
				dataService.fetchCompanies();
				
				popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
				}
	
	function getTotalCost(){
		var totalCost = 0;
		
		if(null == vm.user.orderreference.order){	return;
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
	
	function genCompanyMenuMenuitem(){
		var companyMenuMenuitem = {};
		
		angular.forEach(
				vm.companyMenu, 
				function(
						v, 
						k
						){
					angular.forEach(
							v.menuitems, 
							function(
									v, 
									k
									){	companyMenuMenuitem[v.menuitem_id] = v;
									}
							);
					}
				);
		
		return companyMenuMenuitem;
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
							vm.user.orderreference.order[menuitemOrderId[v.menuitem_id]].cost += vm.companyMenuMenuitem[v.menuitem_id].menuitem_price;
							delete vm.user.orderreference.order[k];
							} else {
								vm.user.orderreference.order[k].quantity = 1;
								vm.user.orderreference.order[k].cost = vm.companyMenuMenuitem[v.menuitem_id].menuitem_price;
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
				if(!(null == vm.company)){
					vm._company = vm.company[vm.companyName];
					if(null == vm._company){	return;
					}
					
					if(!(null == vm._company.branches)){
						vm._branch = vm._company.branches[vm.branchName];
						if(null == vm._branch){	return;
						}
						
						if(!(null == vm._branch.tables)){	vm._table = vm._branch.tables[vm.tableNumber];
						}
						}
					
					if(!(null == vm._company.menus)){	vm.companyMenu = vm._company.menus;
					}
					}
				
				vm.companyMenuMenuitem = genCompanyMenuMenuitem();
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
	
	$scope.$watchCollection(
			function(){	return vm.user.orderreference.order;
			}, 
			function(){	appendQuantity();
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