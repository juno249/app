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
	'reservationService'
	];

function customerReservationController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		$ionicLoading, 
		$ionicPopup, 
		$scope, 
		reservationService
		){
	var vm = this;
	
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
	
	function fetchReservationsSuccessCallback(response){
		hideIonicLoading();
		
		var reservation = localStorage.getItem(KEYS.Reservations);
		reservation = JSON.parse(reservation);
		localStorage.removeItem(KEYS.Reservations);
		vm.user.reservations = {};
		
		angular.forEach(
				reservation, 
				function(
						v, 
						k
						){
					vm.user.reservations[k] = {};
					vm.user.reservations[k].company = v[KEYS.Companies];
					vm.user.reservations[k].branch = v[KEYS.Branches];
					vm.user.reservations[k].orderreference = v[KEYS.Orderreferences];
					vm.user.reservations[k].reservation = v[KEYS.Reservations];
					}
				);
		}
	
	function fetchReservationsFailedCallback(responseError){
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
				
				reservationService.setCustomerUsername(vm.user.username);
				reservationService.fetchReservations(	//getCustomerReservations
						13, 
						{}
						)
				.then(fetchReservationsSuccessCallback)
				.catch(fetchReservationsFailedCallback);
				}
			);
	}