angular
.module('starter')
.controller(
		'tableOrderreferenceController', 
		tableOrderreferenceController
		);

tableOrderreferenceController.$inject = [
                                         'ERROR_MESSAGES', 
                                         'KEYS', 
                                         'LOADING_MESSAGES', 
                                         'ORDERREFERENCE_STATUS', 
                                         '$scope', 
                                         '$state', 
                                         '$stateParams', 
                                         'networkService', 
                                         'orderreferenceService', 
                                         'orderreferenceOrderService', 
                                         'popupService', 
                                         'reservationOrderreferenceOrderService'
                                         ];

function tableOrderreferenceController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDERREFERENCE_STATUS, 
		$scope, 
		$state, 
		$stateParams, 
		networkService, 
		orderreferenceService, 
		orderreferenceOrderService, 
		popupService, 
		reservationOrderreferenceOrderService
		){
	const STATE_RESTAURANT_TABLE_ORDER = 'restaurant.table-order';
	
	var vm = this;
	vm.isReservation = false;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	if(!(null == localStorage.getItem(KEYS.Companies))){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		}
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		}
	
	if(networkService.deviceIsOffline()){
		vm.companyBranchReservation = {};
		vm.companyBranchOrderreference = {};
		}
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.acknowledge = acknowledge;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if(STATE_RESTAURANT_TABLE_ORDER == stateName){
			$state.go(
					stateName, 
					{
						orderreference: JSON.stringify(stateParams), 
						companyName: vm.companyName, 
						branchName: vm.branchName
						}, 
						{	reload: true	}
						);
			}
		}
	
	function acknowledge(
			orderreference
			){
		orderreferenceService.setCompanyName(vm.companyName);
		orderreferenceService.setBranchName(vm.branchName);
		orderreferenceService.setTableNumber(getTableNumberFromId(orderreference.table_id));
		orderreferenceService.setOrderreferenceCode(orderreference.orderreference_code);
		
		var _orderreference = {
				orderreference_status: ORDERREFERENCE_STATUS.in_progress, 
				orderreference_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
				orderreference_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
				}
		
		orderreferenceService.updateOrderreference([_orderreference])
		.then(updateOrderreferenceSuccessCallback)
		.catch(updateOrderreferenceFailedCallback);
		
		popupService.dispIonicLoading(LOADING_MESSAGES.updatingOrderreference);
		
		function updateOrderreferenceSuccessCallback(response){
			popupService.hideIonicLoading();
			
			popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
			
			doFetchReservationsOrderreferencesOrders();
			}
		
		function updateOrderreferenceFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.updateFailed);
			}
		}
	
	function doFetchReservationsOrderreferencesOrders(){
		reservationOrderreferenceOrderService.setCompanyName(vm.companyName);
		reservationOrderreferenceOrderService.setBranchName(vm.branchName);
		reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders(4)
		.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
		.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
		}
	
	function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
		vm.companyBranchReservation = {};
		
		angular.forEach(
				response, 
				function(
						v, 
						k
						){
					vm.companyBranchReservation[k] = {};
					vm.companyBranchReservation[k].reservation = {};
					vm.companyBranchReservation[k].reservation[v.reservations.reservation_code] = v.reservations;
					vm.companyBranchReservation[k].orderreference = {};
					vm.companyBranchReservation[k].orderreference[v.orderreferences.orderreference_code] = v.orderreferences;
					vm.companyBranchReservation[k].order = {};
					vm.companyBranchReservation[k].order= v.orders;
					vm.companyBranchReservation[k].table = {};
					vm.companyBranchReservation[k].table[v.tables.table_number] = v.tables;
					}
				);
		
		orderreferenceOrderService.setCompanyName(vm.companyName);
		orderreferenceOrderService.setBranchName(vm.branchName);
		orderreferenceOrderService.fetchOrderreferencesOrders(4)
		.then(fetchOrderreferencesOrdersSuccessCallback)
		.catch(fetchOrderreferencesOrdersFailedCallback);
		
		function fetchOrderreferencesOrdersSuccessCallback(response){
			vm.companyBranchOrderreference = {};
			
			angular.forEach(
					response, 
					function(
							v, 
							k
							){
						vm.companyBranchOrderreference[k] = {};
						vm.companyBranchOrderreference[k].orderreference = {};
						vm.companyBranchOrderreference[k].orderreference[v.orderreferences.orderreference_code] = v.orderreferences;
						vm.companyBranchOrderreference[k].order = {};
						vm.companyBranchOrderreference[k].order = v.orders;
						vm.companyBranchOrderreference[k].table = {};
						vm.companyBranchOrderreference[k].table[v.tables.table_number] = v.tables;
						}
					);
			
			angular.forEach(
					vm.companyBranchOrderreference, 
					function(
							v, 
							k
							){
						angular.forEach(
								vm.companyBranchReservation, 
								function(
										j, 
										i
										){
									if(!(null == j.orderreference[k])){	delete vm.companyBranchOrderreference[k];
									}
									}
								);
						}
					);
			
			popupService.hideIonicLoading();
			}
		
		function fetchOrderreferencesOrdersFailedCallback(responseError){
			popupService.hideIonicLoading();
			
			popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
			}
		}
	
	function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){
		popupService.hideIonicLoading();
		
		popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
		}
	
	function getTableNumberFromId(tableId){
		var tableNumber = undefined;
		
		angular.forEach(
				vm._branch.tables, 
				function(
						v, 
						k
						){
					if(k == tableId){	tableNumber = v.table_number;
					}
					}
				);
		
		return tableNumber;
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
						}
					}
				}
			);
	
	$scope.$on(
			'$ionicView.afterEnter', 
			function(){
				popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
				
				doFetchReservationsOrderreferencesOrders();
				}
			);
	
	$scope.$on(
			'cloud:push:notification', 
			function(
					event, 
					data
					){
				//do something on push notif
				}
			);
	}