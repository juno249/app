angular
.module('starter')
.contorller(
		'tableOrderController', 
		tableOrderController
		);

tableOrderController.$inject = [
                                '$stateParams'
                                ];

function tableOrderController(
		$stateParams
		){
	var vm = this;
	
	if(!(null == $stateParams.orderreference)){	vm.orderreference = $stateParams.orderreference;
	}
	}