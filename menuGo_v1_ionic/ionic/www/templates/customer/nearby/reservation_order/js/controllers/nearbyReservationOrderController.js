angular
.module('starter')
.controller(
		'nearbyReservationOrderController', 
		nearbyReservationOrderController
		);

nearbyReservationOrderController.$inject = [
	'PAYMENT_MODES', 
	'$localStorage', 
	'$scope'
	];

function nearbyReservationOrderController(
		PAYMENT_MODES, 
		$localStorage, 
		$scope
		){
	const USER_KEY = 'User';
	
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
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrders;
			}, 
			function(){	getTotalCost();
			}
			);
	}