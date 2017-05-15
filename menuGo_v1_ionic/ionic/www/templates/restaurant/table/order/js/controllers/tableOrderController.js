angular
.module('starter')
.controller(
		'tableOrderController', 
		tableOrderController
		);

tableOrderController.$inject = [
                                '$stateParams', 
                                'orderService'
                                ];

function tableOrderController(
		$stateParams, 
		orderService
		){
	var vm = this;
	
	if(!(null == $stateParams.orderreference)){
		vm.orderreference = $stateParams.orderreference;
		vm.orderreference = JSON.parse(vm.orderreference);
		}
	
	//controller_method
	vm.updateOrderStatus = updateOrderStatus;
	
	function updateOrderStatus(orderStatus){
		var order = {
				order_status: orderStatus, 
				order_status_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss'), 
				order_last_change_timestamp: moment(new Date()).format('YYYY-MM-DD h:mm:ss')
				};
		}
	}