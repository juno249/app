angular
.module('starter')
.controller(
		'nearbyReservationOrderController', 
		nearbyReservationOrderController
		);

nearbyReservationOrderController.$inject = [
                                            'ORDER_STATUS', 
                                            'ORDERREFERENCE_STATUS', 
                                            'PAYMENT_MODES', 
                                            'RESERVATION_STATUS', 
                                            '$localStorage', 
                                            '$scope', 
                                            'orderreferenceService', 
                                            'reservationService', 
                                            'reservationOrderreferenceOrderService'
                                            ];

function nearbyReservationOrderController(
		ORDER_STATUS, 
		ORDERREFERENCE_STATUS, 
		PAYMENT_MODES, 
		RESERVATION_STATUS, 
		$localStorage, 
		$scope, 
		orderreferenceService, 
		reservationService, 
		reservationOrderreferenceOrderService
		){
	const USER_KEY = 'User';
	const RESERVATION_TABLE_ID = 999999;
	
	var vm = this;
	vm.paymentModeOptions = PAYMENT_MODES;
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
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
				USER_KEY, 
				JSON.stringify(vm.user)
				);
		}
	
	function getTotalCost(){
		var totalCost = 0;
		
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
			}
		
		function addReservationOrderreferenceOrderSuccessCallback(response){
			reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
			reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders()
			.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
			.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
			
			function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
				vm.user.reservation = response.reservation;
				vm.user.orderreference = response.orderreference;
				
				localStorage.setItem(
						USER_KEY, 
						JSON.stringify(vm.user)
						);
				}
			
			function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){	//do something on failure
			}
			}
		
		function addReservationOrderreferenceOrderFailedCallback(responseError){	//do something on failure
		}
		}
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrder;
			}, 
			function(){	getTotalCost();
			}
			);
	}