angular
.module('starter')
.controller(
		'nearbyReservationOrderController', 
		nearbyReservationOrderController
		);

nearbyReservationOrderController.$inject = [
	'$localStorage', 
	'$scope'
	];

function nearbyReservationOrderController(
		$localStorage, 
		$scope
		){
	const USER_KEY = 'User';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		}
	
	//controller_method
	vm.remReservationOrder = remReservationOrder;
	//controller_method
	vm.getTotalCost = getTotalCost;
	
	function remReservationOrder(menuitem){	delete vm.reservationOrders[menuitem.menuitem_code];
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
			function(){	return vm.reservationOrders;
			}, 
			function(){	getTotalCost();
			}
			);
	}