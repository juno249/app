angular
.module('starter')
.controller('customerNearbyMenuOrderController', customerNearbyMenuOrderController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyMenuOrderController.$inject = [
	'$localStorage'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerNearbyMenuOrderController(
		$localStorage
){
	const MY_ORDERS_KEY= 'My_Orders';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	if(null == localStorage.getItem(MY_ORDERS_KEY)){
		vm.myOrders = {};
	} else {
		var myOrders = localStorage.getItem(MY_ORDERS_KEY);
		myOrders = JSON.parse(myOrders);
		vm.myOrders = myOrders;
	}
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */