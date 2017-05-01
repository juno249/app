angular
.module('starter')
.controller(
		'mymenuMenuController', 
		mymenuMenuController
		);

mymenuMenuController.$inject = [
	'BROADCAST_MESSAGES', 
	'ERROR_MESSAGES', 
	'KEYS', 
	'LOADING_MESSAGES', 
	'ORDER_STATUS', 
	'$ionicLoading', 
	'$ionicPopup', 
	'$scope', 
	'dataService', 
	'orderService', 
	'reservationOrderreferenceOrderService'
	];

function mymenuMenuController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		$ionicLoading, 
		$ionicPopup, 
		$scope, 
		dataService, 
		orderService, 
		reservationOrderreferenceOrderService
		){
	var vm = this;
	vm.companyName = $scope.$parent.customerMymenuController.companyName;
	vm.branchName = $scope.$parent.customerMymenuController.branchName;
	vm.tableNumber = $scope.$parent.customerMymenuController.tableNumber;
	
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		
		if(null == vm.user.reservationOrder){	vm.user.reservationOrder = {};
		}
		}
	
	dispIonicLoading(LOADING_MESSAGES.gettingData);
	
	reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
	reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders(16)
	.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
	.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
	
	function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
		hideIonicLoading();
		
		vm.user.reservation = response.reservations;
		vm.user.orderreference = response.orderreferences;
		vm.user.orderreference.order = vm.user.orderreference.orders;
		delete vm.user.orderreference.orders;
		localStorage.removeItem(KEYS.Reservation);
		
		localStorage.setItem(
				KEYS.User, 
				JSON.stringify(vm.user)
				);
		
		if(!(null == localStorage.getItem(KEYS.Companies))){
			vm.company = localStorage.getItem(KEYS.Companies);
			vm.company = JSON.parse(vm.company);
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
	vm.setMenuName = setMenuName;
	//controller_method
	vm.getMenuIdFromName = getMenuIdFromName;
	//controller_method
	vm.addReservationOrder = addReservationOrder;
	//controller_method
	vm.subReservationOrder = subReservationOrder;
	//controller_method
	vm.postOrder = postOrder;
	
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
	
	function postOrder(){
		var orders = [];
		var order = {};
		
		angular.forEach(
				vm.user.reservationOrder, 
				function(
						v, 
						k
						){
					for(var i=0; i<v.quantity; i++){
						order = {
								menuitem_id: v.menuitem_id, 
								orderreference_code: Object.keys(vm.user.orderreference).orderreference_code, 
								order_status: ORDER_STATUS.queue, 
								order_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
								}
						
						orders.push(order);
						}
					}
				);
		
		orderService.setCompanyName(vm._company.company_name);
		orderService.setBranchName(vm._branch.branch_name);
		orderService.setTableNumber(vm._table.table_number);
		orderService.setOrderreferenceCode(vm.user.orderreference.orderreference_code);
		orderService.addOrder(orders)
		.then(addOrderSuccessCallback)
		.catch(addOrderFailedCallback);
		
		function addOrderSuccessCallback(response){
			hideIonicLoading();
			
			reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
			reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders(16)
			.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
			.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
			
			dispIonicLoading(LOADING_MESSAGES.gettingData);
			
			function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
				hideIonicLoading();
				
				vm.user.reservation = response.reservations;
				vm.user.orderreference = response.orderreferences;
				delete vm.user.reservationOrder;
				localStorage.removeItem(KEYS.Reservations);
				
				localStorage.setItem(
						KEYS.User, 
						JSON.stringify(vm.user)
						);
				}
			
			function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){
				hideIonicLoading();
				
				dispIonicPopup(ERROR_MESSAGES.getFailed);
				}
			}
		
		function addOrderFailedCallback(responseError){
			hideIonicLoading();
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