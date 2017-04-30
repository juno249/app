angular
.module('starter')
.controller(
		'nearbyReservationMenuController', 
		nearbyReservationMenuController
		);

nearbyReservationMenuController.$inject = [
                                           'BROADCAST_MESSAGES', 
                                           'ERROR_MESSAGES', 
                                           'LOADING_MESSAGES', 
                                           '$ionicLoading', 
                                           '$ionicPopup', 
                                           '$localStorage', 
                                           '$scope', 
                                           '$state', 
                                           '$stateParams', 
                                           'branchService', 
                                           'dataService'
                                           ];

function nearbyReservationMenuController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		LOADING_MESSAGES, 
		$ionicLoading, 
		$ionicPopup, 
		$localStorage, 
		$scope, 
		$state, 
		$stateParams, 
		branchService, 
		dataService
		){
	const COMPANIES_KEY = 'Companies';
	const USER_KEY = 'User';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(COMPANIES_KEY))){
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
		} else {
			dataService.fetchCompanies();
			
			dispIonicLoading(LOADING_MESSAGES.gettingData);
			}
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		
		if(null == vm.user.reservationOrder){	vm.user.reservationOrder = {};
		}
		}
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.setMenuName = setMenuName;
	//controller_method
	vm.getMenuIdFromName = getMenuIdFromName;
	//controller_method
	vm.addReservationOrder = addReservationOrder;
	//controller_method
	vm.subReservationOrder = subReservationOrder;
	//controller_method
	vm.toStringBranchAddress = toStringBranchAddress;
	
	function gotoState(stateName){
		if('customer.nearby.reservation_order' == stateName){
			$state.go(
					stateName, 
					{}, 
					{	reload: true	}
					);
			}
		}
	
	function setMenuName(menuName){	vm.menuName = menuName;
	}
	
	function getMenuIdFromName(){	return vm.companyMenus[vm.menuName].menu_id;
	}
	
	function addReservationOrder(menuitem){
		menuitem.quantity++;
		
		vm.user.reservationOrder[menuitem.menuitem_code] = menuitem;
		localStorage.setItem(
				USER_KEY, 
				JSON.stringify(vm.user)
				);
		}
	
	function subReservationOrder(menuitem){
		if(0 >= --menuitem.quantity){
			menuitem.quantity = 0;
			
			delete vm.user.reservationOrder[menuitem.menuitem_code];
			} else {	vm.user.reservationOrder[menuitem.menuitem_code] = menuitem;
			}
		
		localStorage.setItem(
				USER_KEY, 
				JSON.stringify(vm.user)
				);
		}
	
	function toStringBranchAddress(){
		if(null == vm.branch){	return;
		}
		
		branchService.setBranches(vm.branch);
		
		return branchService.toStringAddress();
		}
	
	function genCompanyMenuMenuitems(){
		var companyMenuMenuitems = {};
		
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					if(null == vm.menuName){	vm.menuName = k;
					}
					angular.forEach(
							v.menuitems, 
							function(
									v, 
									k
									){	companyMenuMenuitems[v.menuitem_code] = v;
									}
							);
					}
				);
		
		return companyMenuMenuitems;
		}
	
	function resetCompanyMenuMenuitems(){
		angular.forEach(
				vm.companyMenuMenuitems, 
				function(
						v, 
						k
						){	v.quantity = 0;
						}
				);
		}
	
	function synchronize(){
		angular.forEach(
				vm.companyMenuMenuitems, 
				function(
						v, 
						k
						){
					if(!(null == vm.user.reservationOrder[v.menuitem_code])){	v.quantity = vm.user.reservationOrder[v.menuitem_code].quantity;
					} else {	v.quantity = 0;
					}
					}
				);
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
				resetCompanyMenuMenuitems();
				}
			);
	
	$scope.$watch(
			function(){	return localStorage.getItem(USER_KEY);
			}, 
			function(){
				vm.user = localStorage.getItem(USER_KEY);
				vm.user = JSON.parse(vm.user);
				
				if(null == vm.user.reservationOrder){	vm.user.reservationOrder = {};
				}
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrder;
			}, 
			function(){	synchronize();
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