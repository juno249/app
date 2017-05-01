angular
.module('starter')
.controller(
		'nearbyReservationMenuController', 
		nearbyReservationMenuController
		);

nearbyReservationMenuController.$inject = [
                                           'BROADCAST_MESSAGES', 
                                           'ERROR_MESSAGES', 
                                           'KEYS', 
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
		KEYS, 
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
	var vm = this;
	
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
	
	function getMenuIdFromName(){	return vm.companyMenu[vm.menuName].menu_id;
	}
	
	function addReservationOrder(menuitem){
		menuitem.quantity++;
		
		vm.user.reservationOrder[menuitem.menuitem_code] = menuitem;
		localStorage.setItem(
				KEYS.User, 
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
				KEYS.User, 
				JSON.stringify(vm.user)
				);
		}
	
	function toStringBranchAddress(){
		if(null == vm._branch){	return;
		}
		
		branchService.setBranches(vm._branch);
		
		return branchService.toStringAddress();
		}
	
	function genCompanyMenuMenuitem(){
		var companyMenuMenuitem = {};
		
		angular.forEach(
				vm.companyMenu, 
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
									){	companyMenuMenuitem[v.menuitem_code] = v;
									}
							);
					}
				);
		
		return companyMenuMenuitem;
		}
	
	function resetCompanyMenuMenuitem(){
		angular.forEach(
				vm.companyMenuMenuitem, 
				function(
						v, 
						k
						){	v.quantity = 0;
						}
				);
		}
	
	function synchronize(){
		angular.forEach(
				vm.companyMenuMenuitem, 
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
					
					if(!(null == vm._company.branches)){
						vm._branch = vm._company.branches[vm.branchName];
						
						if(!(null == vm._branch.tables)){	vm._table = vm._branch.tables[vm.tableNumber];
						}
						}
					
					if(!(null == vm._company.menus)){	vm.companyMenu = vm._company.menus;
					}
					}
				
				vm.companyMenuMenuitem = genCompanyMenuMenuitem();
				resetCompanyMenuMenuitem();
				}
			);
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
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