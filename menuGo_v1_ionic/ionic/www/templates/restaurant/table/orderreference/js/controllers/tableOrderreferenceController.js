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
                                         '$scope', 
                                         '$state', 
                                         '$stateParams', 
                                         'networkService', 
                                         'orderreferenceOrderService', 
                                         'popupService', 
                                         'reservationOrderreferenceOrderService'
                                         ];

function tableOrderreferenceController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$scope, 
		$state, 
		$stateParams, 
		networkService, 
		orderreferenceOrderService, 
		popupService, 
		reservationOrderreferenceOrderService
		){
	var vm = this;
	vm.isReservation = false;
	
	//controller_method
	vm.gotoState = gotoState;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if('restaurant.table-order' == stateName){
			$state.go(
					stateName, 
					{	orderreference: stateParams.orderreference	}, 
					{	reload: true	}
					);
			}
		}
		
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	
	if(networkService.deviceIsOffline()){
		vm.companyBranchReservation = {};
		vm.companyBranchOrderreference = {};
	} else {
		popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
		
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
	}