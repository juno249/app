angular
.module('starter')
.controller(
		'customerQrController', 
		customerQrController
		);

customerQrController.$inject = [
                                'BROADCAST_MESSAGES', 
                                'ERROR_MESSAGES', 
                                'KEYS', 
                                'LOADING_MESSAGES', 
                                'ORDERREFERENCE_STATUS', 
                                '$localStorage', 
                                '$scope', 
                                '$state', 
                                '$stateParams', 
                                'dataService', 
                                'popupService', 
                                'qrService'
                                ];

function customerQrController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDERREFERENCE_STATUS, 
		$localStorage, 
		$scope, 
		$state, 
		$stateParams, 
		dataService, 
		popupService, 
		qrService
		){
	const STATE_CUSTOMER_ORDER_MENU = 'restaurant.customer-order_menu';
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	
	//controller_method
	vm.gotoState = gotoState;
	//controller_method
	vm.doScan = doScan;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if(STATE_CUSTOMER_ORDER_MENU == stateName){
			$state.go(
					STATE_CUSTOMER_ORDER_MENU, 
					{
						companyName: vm.companyName, 
						branchName: vm.branchName, 
						tableNumber: vm.tableNumber
						}
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
			
			reservationDetails.companyName = dataSplit[0];
			reservationDetails.branchName = dataSplit[1];
			reservationDetails.tableNumber = dataSplit[2];
			reservationDetails = JSON.stringify(reservationDetails);
			
			localStorage.setItem(
					KEYS.ReservationDetails, 
					reservationDetails
					);
			
			popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
			
			dataService.fetchCompanyBranchOrderreferences(
					reservationDetails.companyName, 
					reservationDetails.branchName, 
					ORDERREFERENCE_STATUS.done
					)
					.then(fetchCompanyBranchOrderreferencesSuccessCallback)
					.catch(fetchCompanyBranchOrderreferencesFailedCallback);
			
			function fetchCompanyBranchOrderreferencesSuccessCallback(response){
			}
			
			function fetchCompanyBranchOrderreferencesFailedCallback(responseError){
			}
			}
		
		function doScanFailedCallback(e){	popupService.dispIonicPopup(ERROR_MESSAGES.scanFailed);
		}
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
				if(!(null == vm.company)){	vm._company = vm.company[vm.companyName];
				}
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
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompanyBranchOrderreferencesSuccess, 
			function(){	popupService.hideIonicLoading();
			}
			);
	
	$scope.$on(
			BROADCAST_MESSAGES.getCompanyBranchOrderreferencesFailed, 
			function(){
				var DOM_POPUP_CLASS = '.popup';
				
				popupService.hideIonicLoading();
				if(0 == $(DOM_POPUP_CLASS).length){	popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
				}
				}
			);
	}