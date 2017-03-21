angular
.module('starter')
.controller('nearbyReservationMenuController', nearbyReservationMenuController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
nearbyReservationMenuController.$inject = [
	'$scope', 
	'$stateParams', 
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
		dataService
	){
	const COMPANIES_KEY = 'Companies';
	
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
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
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
				
				company = companies[companyName];
				branch = company.branches[branchName];
				
				vm.company = company;
				vm.branch = branch;
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */