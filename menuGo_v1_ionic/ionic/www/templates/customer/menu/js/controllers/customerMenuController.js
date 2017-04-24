angular
.module('starter')
.controller(
		'customerMenuController', 
		customerMenuController
		);

customerMenuController.$inject = [
	'RESERVATION_STATUS', 
	'dataService'
	];

function customerMenuController(
		RESERVATION_STATUS, 
		dataService
		){
	const USER_KEY = 'User';
	const COMPANIES_KEY = 'Companies';
	
	var vm = this;
	//dummy data - test (start)
	vm.companyName = "Max's";
	vm.branchName = 'Ermita';
	//dummy data - test (end)
	
	if(null == localStorage.getItem(COMPANIES_KEY)){	dataService.fetchCompanies();
	} else {
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(){
				vm.companies = localStorage.getItem(COMPANIES_KEY);
				vm.companies = JSON.parse(vm.companies);
				}
			);
	}