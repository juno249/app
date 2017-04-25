angular
.module('starter')
.controller(
		'customerMymenuController', 
		customerMymenuController
		);

customerMymenuController.$inject = [
	];

function customerMymenuController(
		){
	var vm = this;
	
	//dummy data - test (start)
	vm.companyName = "Max's";
	vm.branchName = 'Ermita';
	vm.tableNumber = 1;
	//dummy data - test (end)
	}