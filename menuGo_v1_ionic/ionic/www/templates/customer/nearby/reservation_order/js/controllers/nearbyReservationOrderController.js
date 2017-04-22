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
                                            'reservationService'
                                            ];

function nearbyReservationOrderController(
		ORDER_STATUS, 
		ORDERREFERENCE_STATUS, 
		PAYMENT_MODES, 
		RESERVATION_STATUS, 
		$localStorage, 
		$scope, 
		orderreferenceService, 
		reservationService
		){
	const USER_KEY = 'User';
	const RESERVATION_TABLE_ID = 9999999;
	
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
		delete vm.user.reservationOrders[menuitem.menuitem_code];
		
		localStorage.setItem(
				USER_KEY, 
				JSON.stringify(vm.user)
				);
		}
	
	function getTotalCost(){
		vm.totalCost = 0;
		
		angular.forEach(
				vm.user.reservationOrders, 
				function(
						v, 
						k
						){
					vm.totalCost += v.quantity * v.menuitem_price;
					}
				);
		}
	
	function postReservation(){
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
				vm.user.reservationOrders, 
				function(
						v, 
						k
						){
					order = {
							menuitem_id: v.menuitem_id, 
							order_status: ORDER_STATUS.sent, 
							order_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
							};
					}
				);
		}
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrders;
			}, 
			function(){	getTotalCost();
			}
			);
	}