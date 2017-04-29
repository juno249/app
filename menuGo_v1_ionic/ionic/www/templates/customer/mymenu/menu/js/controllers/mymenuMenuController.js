angular
.module('starter')
.controller(
		'mymenuMenuController', 
		mymenuMenuController
		);

mymenuMenuController.$inject = [
	'$scope', 
	'dataService'
	];

function mymenuMenuController(
		$scope, 
		dataService
		){
	const COMPANIES_KEY = 'Companies';
	const USER_KEY = 'User';
	
	var vm = this;
	vm.companyName = $scope.$parent.customerMymenuController.companyName;
	vm.branchName = $scope.$parent.customerMymenuController.branchName;
	vm.tableNumber = $scope.$parent.customerMymenuController.tableNumber;
	
	if(!(null == localStorage.getItem(COMPANIES_KEY))){
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
		} else {	dataService.fetchCompanies();
		}
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		
		if(null == vm.user.reservationOrder){	vm.user.reservationOrder = {};
		}
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(){
				vm.companies = localStorage.getItem(COMPANIES_KEY);
				vm.companies = JSON.parse(vm.companies);
				}
			);
	
	$scope.$watchCollection(
			function(){	return vm.companies;
			}, 
			function(){
				if(!(null == vm.companies)){
					vm.company = vm.companies[vm.companyName];
					
					if(!(null == vm.company.branches)){
						vm.branch = vm.company.branches[vm.branchName];
						
						if(!(null == vm.branch.tables)){	vm.table = vm.branch.tables[vm.tableNumber];
						}
						}
					
					if(!(null == vm.company.menus)){	vm.companyMenus = vm.company.menus;
					}
					}
				}
			);
	}