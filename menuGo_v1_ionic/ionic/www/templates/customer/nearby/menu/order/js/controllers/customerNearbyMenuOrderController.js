angular
.module('starter')
.controller('customerNearbyMenuOrderController', customerNearbyMenuOrderController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyMenuOrderController.$inject = [
	'PAYMENT_METHODS', 
	'$localStorage', 
	'$scope'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerNearbyMenuOrderController(
		PAYMENT_METHODS, 
		$localStorage, 
		$scope
){
	const MY_ORDERS_KEY= 'My_Orders';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	if(null == localStorage.getItem(MY_ORDERS_KEY)){
		vm.myOrders = {};
	} 
	var myOrders = localStorage.getItem(MY_ORDERS_KEY);
	myOrders = JSON.parse(myOrders);
	vm.myOrders = myOrders;	
	vm.myReservation = {
			total: undefined, 
			tableCapacity: undefined, 
			eta: new Date(), 
			paymentMethod: undefined
	}
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.computeTotal = computeTotal;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: computeTotal()
	 * purpose: returns the total of myOrders
	 * ****************************** */
	function computeTotal(){
		var myOrders = vm.myOrders;
		var total = 0;
		
		angular.forEach(myOrders, function(v, k){
			total += 
				v.menuitem_price * 
				v.menuitem_quantity;
		});
		
		vm.myReservation.total = parseFloat(total).toFixed(2);
	}
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){
				return vm.myOrders;
			}, 
			function(nVal, oVal){
				computeTotal();
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */