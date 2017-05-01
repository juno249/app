angular
.module('starter')
.controller(
		'nearbyReservationOrderController', 
		nearbyReservationOrderController
		);

nearbyReservationOrderController.$inject = [
                                            'BROADCAST_MESSAGES', 
                                            'ERROR_MESSAGES', 
                                            'KEYS', 
                                            'LOADING_MESSAGES', 
                                            'ORDER_STATUS', 
                                            'ORDERREFERENCE_STATUS', 
                                            'PAYMENT_MODES', 
                                            'RESERVATION_STATUS', 
                                            '$ionicLoading', 
                                            '$ionicPopup', 
                                            '$localStorage', 
                                            '$scope', 
                                            'orderreferenceService', 
                                            'reservationService', 
                                            'reservationOrderreferenceOrderService'
                                            ];

function nearbyReservationOrderController(
		BROADCAST_MESSAGES, 
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		ORDERREFERENCE_STATUS, 
		PAYMENT_MODES, 
		RESERVATION_STATUS, 
		$ionicLoading, 
		$ionicPopup, 
		$localStorage, 
		$scope, 
		orderreferenceService, 
		reservationService, 
		reservationOrderreferenceOrderService
		){
	const RESERVATION_TABLE_ID = 999999;
	
	var vm = this;
	vm.paymentModeOption = PAYMENT_MODES;
	
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		
		if(null == vm.user.reservation){	vm.user.reservation = {};
		}
		}
	
	//controller_method
	vm.remReservationOrder = remReservationOrder;
	//controller_method
	vm.getTotalCost = getTotalCost;
	//controller_method
	vm.postReservation = postReservation;
	
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
	
	function postReservation(){
		var transParams = [];
		var transParam = {};
		var reservation = {
				customer_username: vm.user.username, 
				reservation_diners_count: vm.user.reservation.dinersCount, 
				reservation_eta: moment(vm.user.reservation.eta).format('YYYY-MM-DD h:mm:ss'), 
				reservation_payment_mode: vm.user.reservation.paymentMode, 
				reservation_service_time: moment(vm.user.reservation.serviceTime).format('YYYY-MM-DD h:mm:ss'), 
				reservation_status: RESERVATION_STATUS.sent, 
				reservation_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
				};
		
		var orderreference = {
				customer_username: vm.user.username, 
				table_id: RESERVATION_TABLE_ID, 
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
						
						orders.push(order);
						}
					}
				);
		
		if(
				reservationService.addReservationValidate(reservation) &&
				orderreferenceService.addOrderreferenceValidate(orderreference)
				){
			transParam.reservation = reservation;
			transParam.orderreference = orderreference;
			transParam.order = orders;
			transParams.push(transParam);
			
			reservationOrderreferenceOrderService.addReservationOrderreferenceOrder(transParams)
			.then(addReservationOrderreferenceOrderSuccessCallback)
			.catch(addReservationOrderreferenceOrderFailedCallback);
			
			dispIonicLoading(LOADING_MESSAGES.sendingReservation);
			}
		
		function addReservationOrderreferenceOrderSuccessCallback(response){
			hideIonicLoading();
			
			reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
			reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders()
			.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
			.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
			
			dispIonicLoading(LOADING_MESSAGES.gettingData);
			
			function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
				hideIonicLoading();
				
				vm.user.reservation = response.reservations;
				vm.user.orderreference = response.orderreferences;
				delete vm.user.reservationOrder;
				
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
		
		function addReservationOrderreferenceOrderFailedCallback(responseError){
			hideIonicLoading();
			
			dispIonicPopup(ERROR_MESSAGES.sendFailed);
		}
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
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrder;
			}, 
			function(){	getTotalCost();
			}
			);
	}