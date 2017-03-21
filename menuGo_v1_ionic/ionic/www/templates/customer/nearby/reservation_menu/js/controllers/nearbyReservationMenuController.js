angular
.module('starter')
.controller('nearbyReservationMenuController', nearbyReservationMenuController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
nearbyReservationMenuController.$inject = [
	'$scope', 
	'$stateParams', 
	'branchService', 
	'dataService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function nearbyReservationMenuController(
		$scope, 
		$stateParams, 
		branchService, 
		dataService
	){
	const COMPANIES_KEY = 'Companies';
	const ORDERS_KEY = 'Orders';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	var companies = undefined;
	if(null == localStorage.getItem(COMPANIES_KEY)){
		dataService.fetchCompanies();
		vm.companies = undefined;
	} else {
		companies = localStorage.getItem(COMPANIES_KEY);
		companies = JSON.parse(companies);
		vm.companies = companies;
	}
	var companyName = undefined;
	if(!(null == $stateParams.companyName)){
		companyName = $stateParams.companyName;
		vm.companyName = companyName;
	} else {
		vm.companyName = companyName;
	}
	vm.company = undefined;
	var branchName = undefined;
	if(!(null == $stateParams.branchName)){
		branchName = $stateParams.branchName;
		vm.branchName = branchName;
	} else {
		vm.branchName = branchName;
	}
	vm.branch = undefined;
	vm.companyMenus = undefined;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.toggleVis = toggleVis;
	vm.toStringAddress = toStringAddress;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: toggleVis()
	 * purpose: toggles visibility
	 * ****************************** */
	function toggleVis(menu){
		resetVis(menu);
		
		menu.isCompanyMenuHidden = !menu.isCompanyMenuHidden;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: toStringAddress()
	 * purpose: returns an address string
	 * ****************************** */
	function toStringAddress(){
		var branch = vm.branch;
		
		branchService.setBranch(branch);
		
		return branchService.toStringAddress();
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: resetVis()
	 * purpose: returns an address string
	 * ****************************** */
	function resetVis(exemptMenu){
		var companyMenus = vm.companyMenus;
		
		angular.forEach(companyMenus, function(v, k){
			if(!(exemptMenu.menu_name == v.menu_name)){
				v['isCompanyMenuHidden'] = true;
			}
		});
		
		vm.companyMenus = companyMenus;
	}
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){
				return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(
					nVal, 
					oVal
				){
				var companies = vm.companies;
				
				companies = localStorage.getItem(COMPANIES_KEY);
				companies = JSON.parse(companies);
				
				vm.companies = companies;
			}
	);
	
	$scope.$watch(
			function(){
				return vm.companies;
			}, 
			function(
					nVal, 
					oVal
				){
				var companies = vm.companies;
				var company = vm.company;
				var companyName = vm.companyName;
				var branch = vm.branch;
				var branchName = vm.branchName;
				var companyMenus = vm.companyMenus;
				
				company = companies[companyName];
				branch = company.branches[branchName];
				companyMenus = company.menus;
				
				vm.company = company;
				vm.branch = branch;
				vm.companyMenus = companyMenus;
				
				resetVis(new String(''));
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */