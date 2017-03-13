angular
.module('starter')
.controller('customerNearbyMenuController', customerNearbyMenuController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerNearbyMenuController.$inject = [
	'$localStorage', 
	'$scope', 
	'$state', 
	'$stateParams', 
	'branchService'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerNearbyMenuController(
		$localStorage, 
		$scope, 
		$state, 
		$stateParams, 
		branchService
){
	const COMPANIES_KEY = 'Companies';
	const MY_ORDERS_KEY= 'My_Orders';
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
	if (null == localStorage.getItem(MY_ORDERS_KEY)) {
		vm.myOrders = {};
	} else {
		var myOrders = localStorage.getItem(MY_ORDERS_KEY);
		myOrders = JSON.parse(myOrders);
		vm.myOrders = myOrders;
	}
	/* ******************************
	 * Cont roller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Controller Binded Method (Start)
	 * ****************************** */
	vm.gotoState = gotoState;
	vm.toStringAddress = toStringAddress;
	vm.incCustomerOrder = incCustomerOrder;
	/* ******************************
	 * Controller Binded Method (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: gotoState()
	 * purpose: go to a state
	 * ****************************** */
	function gotoState(
			toStateName, 
			toStateParams
	){
		if('customer.nearby.menu.order' == toStateName){
			$state.go(toStateName, {}, {reload:true});
		}
	}
	
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
	 * Method Implementation
	 * method name: incCustomerOrder()
	 * purpose: increase customer order quantity
	 * ****************************** */
	function incCustomerOrder(menuitemCode){
		var myOrders = vm.myOrders;
		
		myOrders[menuitemCode].menuitem_quantity++;
		myOrders[menuitemCode].menuitem_total = 
				myOrders[menuitemCode].menuitem_price * 
				myOrders[menuitemCode].menuitem_quantity;
		
		vm.myOrders = myOrders;
		myOrders = JSON.stringify(myOrders);
		localStorage.setItem(MY_ORDERS_KEY, myOrders);
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: initializeMyOrders()
	 * purpose: initializes myOrders
	 * ****************************** */
	function initializeMyOrders() {
		var myOrders = vm.myOrders;
		var company = vm.company;
		var companyMenus = company.menus;

		angular.forEach(companyMenus, function(v, k) {
			var companyMenuMenuitems = v.menuitems;

			angular.forEach(companyMenuMenuitems, function(j, i) {
				myOrders[j.menuitem_code] = {
						'menuitem_name': j.menuitem_name, 
						'menu_name': k, 
						'menuitem_quantity': 0, 
						'menuitem_price': j.menuitem_price, 
						'menuitem_total': 0
				}
			});
		});
		
		vm.myOrders = myOrders;
		myOrders = JSON.stringify(myOrders);
		localStorage.setItem(MY_ORDERS_KEY, myOrders);
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
				
				initializeMyOrders();
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */