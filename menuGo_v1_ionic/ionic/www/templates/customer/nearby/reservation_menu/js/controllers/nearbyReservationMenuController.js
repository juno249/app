angular
.module('starter')
.controller('nearbyReservationMenuController', nearbyReservationMenuController);

nearbyReservationMenuController.$inject = [
	'$scope', 
	'$stateParams', 
	'branchService', 
	'dataService'
	];

function nearbyReservationMenuController(
		$scope, 
		$stateParams, 
		branchService, 
		dataService
		){
	const COMPANIES_KEY = 'Companies';
	
	var vm = this;
	
	if(null == localStorage.getItem(COMPANIES_KEY)){
		dataService.fetchCompanies();
	} else {
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
	}
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;	
	}
	
	//controller_method
	vm.toggleVis = toggleVis;
	//controller_method
	vm.toStringAddress = toStringAddress;
	
	function toggleVis(menu){
		resetVis(menu);
		
		menu.isCompanyMenuHidden = !menu.isCompanyMenuHidden;
	}
	
	function toStringAddress(){
		branchService.setBranch(vm.branch);
		
		return branchService.toStringAddress();
	}
	
	function resetVis(exemptMenu){
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					if(!(exemptMenu.menu_name == v.menu_name)){	v['isCompanyMenuHidden'] = true;
					}
				}
				);
	}
	
	$scope.$watch(
			function(){	return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(){
				vm.companies = localStorage.getItem(COMPANIES_KEY);
				vm.companies = JSON.parse(vm.companies);
			}
	);
	
	$scope.$watch(
			function(){	return vm.companies;
			}, 
			function(){
				vm.company = vm.companies[vm.companyName];
				vm.branch = vm.company.branches[vm.branchName];
				vm.companyMenus = vm.company.menus;
				
				resetVis(new String(''));
			}
	);
}