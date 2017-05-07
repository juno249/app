angular
.module('starter')
.controller(
		'customerOrderOrderController', 
		customerOrderOrderController
		);

customerOrderOrderController.$inject = [
	'ERROR_MESSAGES', 
	'KEYS', 
	'LOADING_MESSAGES', 
	'ORDER_STATUS', 
	'ORDERREFERENCE_STATUS', 
	'PAYMENT_MODES', 
	'$localStorage', 
	'$scope', 
	'orderService', 
	'orderreferenceService', 
	'orderreferenceOrderService', 
	'popupService'
	];

function customerOrderOrderController(
		ERROR_MESSAGES, 
		KEYS, 
		LOADING_MESSAGES, 
		ORDER_STATUS, 
		ORDERREFERENCE_STATUS, 
		$localStorage, 
		$scope, 
		orderService, 
		orderreferenceService, 
		orderreferenceOrderService, 
		popupService
		){
	var vm = this;
	
	//controller_method
	vm.remReservationOrder = remReservationOrder;
	//controller_method
	vm.getTotalCost = getTotalCost;
	//controller_method
	vm.PostOrderreference = PostOrderreference;
	
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
	
	function PostOrderreference(){
	}
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
				vm.user = JSON.parse(vm.user);
				
				if(null == vm.user.reservationOrder){	vm.user.reservationOrder = {};
				}
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.user.reservationOrder;
			}, 
			function(){	getTotalCost();
			}
			);
	}