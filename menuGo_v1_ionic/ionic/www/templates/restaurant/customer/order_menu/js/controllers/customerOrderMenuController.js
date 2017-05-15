angular
.module('starter')
.controller(
		'customerOrderMenuController', 
		customerOrderMenuController
		);

customerOrderMenuController.$inject = [
	'KEYS', 
	'$localStorage', 
	'$scope', 
	'$state', 
	'$stateParams'
	];

function customerOrderMenuController(
		KEYS, 
		$localStorage, 
		$scope, 
		$state, 
		$stateParams
		){
	const STATE_RESTAURANT_CUSTOMER_ORDER_ORDER = 'restaurant.customer-order_order';
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	if(!(null == $stateParams.tableNumber)){	vm.tableNumber = $stateParams.tableNumber;
	}
	if(
			!(null == $stateParams.orderreferenceCode) &&
			!(0 == $stateParams.orderreferenceCode.length)
			){	vm.orderreferenceCode = $stateParams.orderreferenceCode;
			}
	if(!(null == localStorage.getItem(KEYS.Companies))){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		}
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
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
	
	function gotoState(stateName){
		if(STATE_RESTAURANT_CUSTOMER_ORDER_ORDER == stateName){
			var stateParams = {
					companyName: vm.companyName, 
					branchName: vm.branchName, 
					tableNumber: vm.tableNumber
					}
			
			if(!(null == vm.orderreferenceCode)){	stateParams.orderreferenceCode = vm.orderreferenceCode;
			}
			
			$state.go(
					stateName, 
					stateParams, 
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
				resetCompanyMenuMenuitem();
				synchronize();
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrder;
			}, 
			function(){	synchronize();
			}
			);
	}