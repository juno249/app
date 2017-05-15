angular
.module('starter')
.controller(
		'customerQrController', 
		customerQrController
		);

customerQrController.$inject = [
                                'ERROR_MESSAGES', 
                                'KEYS', 
                                'LOADING_MESSAGES', 
                                'PROMPT_MESSAGES', 
                                '$ionicPopup', 
                                '$localStorage', 
                                '$scope', 
                                '$state', 
                                '$stateParams', 
                                'orderreferenceOrderService', 
                                'popupService', 
                                'qrService'
                                ];

function customerQrController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		PROMPT_MESSAGES, 
		$ionicPopup, 
		$localStorage, 
		$scope, 
		$state, 
		$stateParams, 
		orderreferenceOrderService, 
		popupService, 
		qrService
		){
	const STATE_RESTAURANT_CUSTOMER_ORDER_MENU = 'restaurant.customer-order_menu';
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
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
	vm.doScan = doScan;
	
	function gotoState(stateName){
		if(STATE_RESTAURANT_CUSTOMER_ORDER_MENU == stateName){
			var stateParams = {
					companyName: vm.companyName, 
					branchName: vm.branchName, 
					tableNumber: vm.tableNumber
					}
			
			if(!(null == vm.orderreferenceCode)){	stateParams.orderreferenceCode = vm.orderreferenceCode;
			}
			
			$state.go(
					STATE_RESTAURANT_CUSTOMER_ORDER_MENU, 
					stateParams, 
					{	reload: true	}
					);
			}
		}
	
	function doScan(){
		qrService.doScan()
		.then(doScanSuccessCallback)
		.catch(doScanFailedCallback);
		
		function doScanSuccessCallback(data){
			const DELIMETER = ';';
			var reservationDetails = {};
			var dataSplit = data.text.split(DELIMETER);
			
			reservationDetails.companyName = vm.companyName = dataSplit[0];
			reservationDetails.branchName = vm.branchName = dataSplit[1];
			reservationDetails.tableNumber = vm.tableNumber = dataSplit[2];
			reservationDetails = JSON.stringify(reservationDetails);
			
			localStorage.setItem(
					KEYS.ReservationDetails, 
					reservationDetails
					);
			
			popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
			
			orderreferenceOrderService.setCompanyName(vm.companyName);
			orderreferenceOrderService.setBranchName(vm.branchName);
			orderreferenceOrderService.setTableNumber(vm.tableNumber);
			orderreferenceOrderService.fetchOrderreferencesOrders(8)
			.then(fetchOrderreferencesOrdersSuccessCallback)
			.catch(fetchOrderreferencesOrdersFailedCallback);
			
			function fetchOrderreferencesOrdersSuccessCallback(response){
				popupService.hideIonicLoading();
				
				var orderreferenceCode = undefined;
				angular.forEach(
						response, 
						function(
								v, 
								k
								){	orderreferenceCode = k;
								}
						);
				
				if(null == orderreferenceCode){	gotoState(STATE_RESTAURANT_CUSTOMER_ORDER_MENU);
				} else {
					$ionicPopup.confirm(
							{	template: "<span class='font-family-1-size-small'>" + PROMPT_MESSAGES.yesNoExistingOrderreference	+ "</span>"
								}
							)
							.then(promptCallback);
					
					function promptCallback(response){
						if(response){
							vm.orderreferenceCode = orderreferenceCode;
							
							gotoState(STATE_RESTAURANT_CUSTOMER_ORDER_MENU);
						} else{
						}
						}
					}
				}
			
			function fetchOrderreferencesOrdersFailedCallback(responseError){
				popupService.hideIonicLoading();
				
				popupService.dispIonidPopup(ERROR_MESSAGES.getFailed);
				}
			}
		
		function doScanFailedCallback(e){	popupService.dispIonicPopup(ERROR_MESSAGES.scanFailed);
		}
		}
	
	$scope.$watchCollection(
			function(){	return vm.company;
			}, 
			function(){
				if(!(null == vm.company)){	vm._company = vm.company[vm.companyName];
				}
				}
			);
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.ReservationDetails);
			}, 
			function(){
				vm.reservationDetails = localStorage.getItem(KEYS.ReservationDetails);
				vm.reservationDetails = JSON.parse(vm.reservationDetails);
				}
			);
	
	$scope.$watch(
			function(){	return vm.reservationDetails;
			}, 
			function(){
				if(null == vm.reservationDetails){
					vm.reservationDetails = {};
					return;
					}
				
				vm.companyName = vm.reservationDetails.companyName;
				vm.branchName = vm.reservationDetails.branchName;
				vm.tableNumber = vm.reservationDetails.tableNumber;
				}
			);
	}