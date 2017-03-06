angular
.module('starter')
.controller('customerNearbyController', customerNearbyController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyController.$inject = [
	'$scope', 
	'dataService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerNearbyController(
		$scope, 
		dataService
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
	vm.companiesMenuitems = undefined;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	loadCompaniesMenuitems();
	
	/* ******************************
	 * Method Implementation
	 * method name: loadCompaniesMenuitems()
	 * purpose: loads companies menuitems
	 * ****************************** */
	function loadCompaniesMenuitems(){
		var companies = vm.companies;
		var companiesMenuitems = {};
		
		angular.forEach(companies, function(v, k){
			var company = v;
			var companyMenus = company.menus;
			var companyMenuitems = [];
			
			angular.forEach(companyMenus, function(v, k){
				var companyMenu = v;
				var companyMenuMenuitems = v.menuitems;
				
				angular.forEach(companyMenuMenuitems, function(v, k){
					var companyMenuMenuitem = v;
					
					if(1 == companyMenuMenuitem.menuitem_featured){
						companyMenuitems.push(companyMenuMenuitem);
					}
				});
			});
			
			companiesMenuitems[k] = companyMenuitems;
		});
		
		vm.companiesMenuitems = companiesMenuitems;
	}
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
		function(){
			return localStorage.getItem(COMPANIES_KEY);
		}, 
		function(nVal, oVal){
			var companies = nVal;
			companies = JSON.parse(companies);
			vm.companies = companies;
			
			loadCompaniesMenuitems();
		}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */