angular
.module('starter')
.controller(
		'mymenuBillController', 
		mymenuBillController
		);

mymenuBillController.$inject = [
	'$scope', 
	'dataService'
	];

function mymenuBillController(
		$scope, 
		dataService
		){
	const COMPANIES_KEY = 'Companies';
	const USER_KEY = 'User';
	
	var vm = this;
	
	if(!(null == localStorage.getItem(COMPANIES_KEY))){
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
	} else {	dataService.fetchCompanies();
	}
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		}
	}