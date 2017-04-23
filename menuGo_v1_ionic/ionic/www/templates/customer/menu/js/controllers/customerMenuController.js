angular
.module('starter')
.controller(
		'customerMenuController', 
		customerMenuController
		);

customerMenuController.$inject = [
	'RESERVATION_STATUS', 
	'$stateParams', 
	'branchService', 
	'companyService', 
	'orderService', 
	'reservationService', 
	'reservationOrderreferenceOrderService'
	];

function customerMenuController(
		RESERVATION_STATUS, 
		$stateParams, 
		branchService, 
		companyService, 
		orderService, 
		reservationService, 
		reservationOrderreferenceOrderService
		){
	const USER_KEY = 'User';
	//dummy data - test (start)
	const QR_COMPANY_NAME = "Max's";
	const QR_BRANCH_NAME = 'Ermita';
	//dummy data - test (end)
	
	var vm = this;
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		}
	}