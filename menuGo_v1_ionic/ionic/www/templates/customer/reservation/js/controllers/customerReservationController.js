angular
.module('starter')
.controller(
		'customerReservationController', 
		customerReservationController
		);

customerReservationController.$inject = [
	'ERROR_MESSAGES', 
	'KEYS', 
	'LOADING_MESSAGES', 
	'$scope', 
	'networkService', 
	'popupService', 
	'reservationOrderreferenceOrderService'
	];

function customerReservationController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$scope, 
		networkService, 
		popupService, 
		reservationOrderreferenceOrderService
		){
	var vm = this;
	
	//controller_method
	vm.setReservationStatus = setReservationStatus;
	
	function setReservationStatus(reservationStatus){	vm.reservationStatus = reservationStatus;
	}
	
	$scope.$on(
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
				vm.user = JSON.parse(vm.user);
				}
			);
	
	$scope.$on(
			'$ionicView.afterEnter', 
			function(){
				if(!(null == vm.user)){
					popupService.dispIonicLoading(LOADING_MESSAGES.gettingData);
					
					reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
					reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders(16)
					.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
					.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
					}
				
				function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
					popupService.hideIonicLoading();
					
					vm.user.reservation = response.reservations;
					vm.user.orderreference = response.orderreferences;
					vm.user.orderreference.order = vm.user.orderreference.orders;
					delete vm.user.orderreference.orders;
					delete vm.user.reservationOrder;
					localStorage.removeItem(KEYS.Reservations);
					
					localStorage.setItem(
							KEYS.User, 
							JSON.stringify(vm.user)
							);
					}
				
				function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){
					popupService.hideIonicLoading();
					
					popupService.dispIonicPopup(ERROR_MESSAGES.getFailed);
					}
				}
			);
	}