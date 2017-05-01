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
	'$ionicLoading', 
	'$ionicPopup', 
	'$scope', 
	'reservationOrderreferenceOrderService'
	];

function customerReservationController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$ionicLoading, 
		$ionicPopup, 
		$scope, 
		reservationOrderreferenceOrderService
		){
	var vm = this;
	
	//controller_method
	vm.setReservationStatus = setReservationStatus;
	
	function setReservationStatus(reservationStatus){	vm.reservationStatus = reservationStatus;
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
	
	function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
		hideIonicLoading();
		}
	
	function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){
		hideIonicLoading();
		}
	
	$scope.$on(
			'$ionicView.beforeEnter', 
			function(){
				if(!(null == localStorage.getItem(KEYS.User))){
					vm.user = localStorage.getItem(KEYS.User);
					vm.user = JSON.parse(vm.user);
					}
				
				dispIonicLoading(LOADING_MESSAGES.gettingData);
				
				reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
				reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders(	//getCustomerReservations
						13, 
						{}
						)
				.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
				.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
				}
			);
	}