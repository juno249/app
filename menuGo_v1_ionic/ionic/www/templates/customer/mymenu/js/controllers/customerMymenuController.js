angular
.module('starter')
.controller(
		'customerMenuController', 
		customerMenuController
		);

customerMenuController.$inject = [
	'RESERVATION_STATUS', 
	'$scope', 
	'dataService', 
	'reservationOrderreferenceOrderService'
	];

function customerMenuController(
		RESERVATION_STATUS, 
		$scope, 
		dataService, 
		reservationOrderreferenceOrderService
		){
	const COMPANIES_KEY = 'Companies';
	const USER_KEY = 'User';
	
	var vm = this;
	//dummy data - test (start)
	vm.companyName = "Max's";
	vm.branchName = 'Ermita';
	vm.tableNumber = 1;
	//dummy data - test (end)
	
	if(!(null == localStorage.getItem(COMPANIES_KEY))){
		vm.companies = localStorage.getItem(COMPANIES_KEY);
		vm.companies = JSON.parse(vm.companies);
	} else {	dataService.fetchCompanies();
	}
	
	if(!(null == localStorage.getItem(USER_KEY))){
		vm.user = localStorage.getItem(USER_KEY);
		vm.user = JSON.parse(vm.user);
		
		if(!(null == vm.user.reservation)){
		} else {
			reservationOrderreferenceOrderService.setCustomerUsername(vm.user.username);
			reservationOrderreferenceOrderService.fetchReservationsOrderreferencesOrders()
			.then(fetchReservationsOrderreferencesOrdersSuccessCallback)
			.catch(fetchReservationsOrderreferencesOrdersFailedCallback);
			}
		}
	
	function fetchReservationsOrderreferencesOrdersSuccessCallback(response){
		vm.user.reservation = response.reservation;
		vm.user.orderreference = response.orderreference;
		}
	
	function fetchReservationsOrderreferencesOrdersFailedCallback(responseError){	//do something on failure
	}
	
	function genCompanyMenuMenuitems(){
		var companyMenuMenuitems = {};
		
		angular.forEach(
				vm.companyMenus, 
				function(
						v, 
						k
						){
					angular.forEach(
							v.menuitems, 
							function(
									v, 
									k
									){	companyMenuMenuitems[k] = v;
									}
							);
					}
				);
		
		return companyMenuMenuitems;
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
				
				vm.companyMenuMenuitems = genCompanyMenuMenuitems();
				}
			);
	}