angular
.module('starter')
.controller('customerMenuController', customerMenuController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerMenuController.$inject = [
	'$localStorage', 
	'$scope', 
	'$stateParams', 
	'branchService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerMenuController(
		$localStorage, 
		$scope, 
		$stateParams, 
		branchService
){
	const COMPANIES_KEY = 'Companies';
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	if(null == localStorage.getItem(COMPANIES_KEY)){
		dataService.fetchCompanies();
	}
	var companies = localStorage.getItem(COMPANIES_KEY);
	companies = JSON.parse(companies);
	vm.companies = companies;
	vm.company = undefined;
	vm.branch = undefined;
	vm.companyName = $stateParams['companyName'];
	vm.branchName = $stateParams['branchName'];
	/* ******************************
	 * Cont roller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.toStringAddress = toStringAddress;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: toStringAddress()
	 * purpose: returns an address string
	 * ****************************** */
	function toStringAddress(branch){
		branchService.setBranch(branch);
		
		return branchService.toStringAddress();
	}
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){
				return localStorage.getItem(COMPANIES_KEY);
			}, 
			function(nVal, oVal){
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
			function(nVal, oVal){
				var company = vm.company;
				var branch = vm.branch;
				var companyName = vm.companyName;
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