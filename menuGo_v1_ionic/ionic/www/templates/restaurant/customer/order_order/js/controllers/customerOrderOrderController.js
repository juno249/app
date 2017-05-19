angular
.module('starter')
.controller(
		'customerOrderOrderController', 
		customerOrderOrderController
		);

customerOrderOrderController.$inject = [
	'ERROR_MESSAGES', 
	'KEYS', 
	'LOADING_MESSAGES', 
	'ORDER_STATUS', 
	'ORDERREFERENCE_STATUS', 
	'SUCCESS_MESSAGES', 
	'$ionicHistory', 
	'$localStorage', 
	'$scope', 
	'$state', 
	'$stateParams', 
	'orderService', 
	'orderreferenceOrderService', 
	'orderreferenceService', 
	'popupService'
	];

function customerOrderOrderController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		ORDERREFERENCE_STATUS, 
		SUCCESS_MESSAGES, 
		$ionicHistory, 
		$localStorage, 
		$scope, 
		$state, 
		$stateParams, 
		orderService, 
		orderreferenceOrderService, 
		orderreferenceService, 
		popupService
		){
	const STATE_RESTAURANT_HOME = 'restaurant.home';
	
	var vm = this;
	
	//controller_method
	vm.gotoState = gotoState;
	
	function gotoState(stateName){
		if(STATE_RESTAURANT_HOME == stateName){
			$state.go(
					STATE_RESTAURANT_HOME, 
					{	companyName: vm.companyName	}, 
					{	reload: true	}
					);
		}
	}
	
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
	vm.remReservationOrder = remReservationOrder;
	//controller_method
	vm.getTotalCost = getTotalCost;
	//controller_method
	vm.postOrderreference = postOrderreference;
	
	function remReservationOrder(menuitem){
		delete vm.user.reservationOrder[menuitem.menuitem_code];
		
		localStorage.setItem(
				KEYS.User, 
				JSON.stringify(vm.user)
				);
		}
	
	function getTotalCost(){
		var totalCost = 0;
		
		if(null == vm.user.reservationOrder){	return;
		}
		
		angular.forEach(
				vm.user.reservationOrder, 
				function(
						v, 
						k
						){	totalCost += v.quantity * v.menuitem_price;
						}
				);
		
		return totalCost;
		}
	
	function postOrderreference(){
		var transParams = [];
		var transParam = {};
		var orderreference = {
				customer_username: vm.user.username, 
				table_id: vm._table.table_id, 
				orderreference_status: ORDERREFERENCE_STATUS.sent, 
				orderreference_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
				};
		
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
								order_status: ORDER_STATUS.queue, 
								order_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
								};
						if(!(null == vm.user.orderreference)){	order.orderreference_code = vm.user.orderreference.orderrreference_code;
						}
						
						orders.push(order);
						}
					}
				);
		
		if(null == vm.orderreferenceCode){
			if(orderreferenceService.addOrderreferenceValidate(orderreference)){
				transParam.orderreference = orderreference;
				transParam.order = orders;
				transParams.push(transParam);
				
				orderreferenceOrderService.setCompanyName(vm.companyName);
				orderreferenceOrderService.setBranchName(vm.branchName);
				orderreferenceOrderService.setTableNumber(vm.tableNumber);
				orderreferenceOrderService.addOrderreferenceOrder(transParams)
				.then(addOrderreferenceOrderSuccessCallback)
				.catch(addOrderreferenceOrderFailedCallback);
				
				popupService.dispIonicLoading(LOADING_MESSAGES.sendingReservation);
				}
			} else {
				transParam.order = orders;
				transParams.push(transParam);
				
				orderService.setCompanyName(vm.companyName);
				orderService.setBranchName(vm.branchName);
				orderService.setTableNumber(vm.tableNumber);
				orderService.setOrderreferenceCode(vm.orderreferenceCode);
				orderService.addOrder(orders)
				.then(addOrderSuccessCallback)
				.catch(addOrderFailedCallback);
				
				popupService.dispIonicLoading(LOADING_MESSAGES.sendingReservation);
				}
		
		function addOrderreferenceOrderSuccessCallback(response){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(SUCCESS_MESSAGES.postOrderSuccess);
			
			vm.user.reservationOrder = {};
			localStorage.setItem(
					KEYS.User, 
					JSON.stringify(vm.user)
					);
			
			$ionicHistory.clearHistory();
			gotoState(STATE_RESTAURANT_HOME);
			}
		
		function addOrderreferenceOrderFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.sendFailed);
			}
		
		function addOrderSuccessCallback(response){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(SUCCESS_MESSAGES.postOrderSuccess);
			
			vm.user.reservationOrder = {};
			localStorage.setItem(
					KEYS.User, 
					JSON.stringify(vm.user)
					);
			
			$ionicHistory.clearHistory();
			gotoState(STATE_RESTAURANT_HOME);
			}
		
		function addOrderFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.sendFailed);
			}
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
					}
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrder;
			}, 
			function(){	getTotalCost();
			}
			);
	}