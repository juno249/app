angular
.module('starter')
.controller(
		'nearbyReservationMenuController', 
		nearbyReservationMenuController
		);

nearbyReservationMenuController.$inject = [
	'$localStorage', 
	'$scope', 
	'$state', 
	'$stateParams', 
	'branchService', 
	'dataService'
	];

function nearbyReservationMenuController(
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
	
	if(null == localStorage.getItem(COMPANIES_KEY)){	dataService.fetchCompanies();
	} else {
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
		}
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		
		if(null == vm.user.reservationOrders){	vm.user.reservationOrders = {};
		}
		}
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;	
	}
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.toggleVis = toggleVis;
	//controller_method
	vm.toStringAddress = toStringAddress;
	//controller_method
	vm.addReservationOrder = addReservationOrder;
	//controller_method
	vm.subReservationOrder = subReservationOrder;
	
	function gotoState(stateName){
		if('customer.nearby.reservation_order' == stateName){
			$state.go(
					stateName, 
					{}, 
					{	reload: true	}
					);
			}
		}
	
	function toggleVis(menu){
		resetVis(menu);
		
		menu.isCompanyMenuHidden = !menu.isCompanyMenuHidden;
		}
	
	function toStringAddress(){
		branchService.setBranch(vm.branch);
		
		return branchService.toStringAddress();
		}
	
	function resetVis(exemptMenu){
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					if(!(exemptMenu.menu_name == v.menu_name)){	v.isCompanyMenuHidden = true;
					}
					}
				);
		}
	
	function resetCompanyMenus(){
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					v.quantity = 0;
					angular.forEach(
							v.menuitems, 
							function(
									j, 
									i
									){
								j.quantity = 0;
								}
							);
					}
				);
		}
	
	function addReservationOrder(
			menu, 
			menuitem
			){
		menu.quantity++;
		menuitem.quantity++;
		
		vm.user.reservationOrders[menuitem.menuitem_code] = menuitem;
		localStorage.setItem(
				USER_KEY, 
				JSON.stringify(vm.user)
				);
		}
	
	function subReservationOrder(
			menu, 
			menuitem
			){
		if(0 >= --menu.quantity){	menu.quantity = 0;
		}
		
		if(0 >= --menuitem.quantity){
			menuitem.quantity = 0;
			
			delete vm.user.reservationOrders[menuitem.menuitem_code];
		} else {	vm.user.reservationOrders[menuitem.menuitem_code] = menuitem;
		}
		
		localStorage.setItem(
				USER_KEY, 
				JSON.stringify(vm.user)
				);
		}
	
	function synchronize(){
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					v.quantity = 0;
					angular.forEach(
							v.menuitems, 
							function(
									j, 
									i
									){
								if(!(null == vm.user.reservationOrders[j.menuitem_code])){
									j.quantity = vm.user.reservationOrders[j.menuitem_code].quantity;
									v.quantity += j.quantity;
								} else {	j.quantity = 0;
								}
								}
							);
					}
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
				vm.company = vm.companies[vm.companyName];
				vm.branch = vm.company.branches[vm.branchName];
				vm.companyMenus = vm.company.menus;
				
				resetVis(new String(''));
				resetCompanyMenus();
				}
			);
	
	$scope.$watch(
			function(){	return localStorage.getItem(USER_KEY);
			}, 
			function(){
				vm.user = localStorage.getItem(USER_KEY);
				vm.user = JSON.parse(vm.user);
				
				if(null == vm.user.reservationOrders){	vm.user.reservationOrders = {};
				}
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrders;
			}, 
			function(){	synchronize();
			}
			);
	}