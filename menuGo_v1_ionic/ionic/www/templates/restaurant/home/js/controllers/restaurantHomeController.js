angular
.module('starter')
.controller(
		'restaurantHomeController', 
		restaurantHomeController
		);

restaurantHomeController.$inject = [
	'KEYS', 
	'$ionicHistory', 
	'$scope', 
	'$state', 
	'$stateParams'
	];

function restaurantHomeController(
		KEYS, 
		$ionicHistory, 
		$scope, 
		$state, 
		$stateParams
		){
	const STATE_RESTAURANT_CUSTOMER_LAUNCH = 'restaurant.customer-launch';
	const STATE_RESTAURANT_TABLE_ORDERREFERENCE = 'restaurant.table-orderreference';
	
	$ionicHistory.clearHistory();
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == localStorage.getItem(KEYS.Companies))){
		vm.company = localStorage.getItem(KEYS.Companies);
		vm.company = JSON.parse(vm.company);
		}
	if(!(null == localStorage.getItem(KEYS.User))){
		vm.user = localStorage.getItem(KEYS.User);
		vm.user = JSON.parse(vm.user);
		}
	
	//controller_method
	vm.gotoState = gotoState;
	
	function gotoState(stateName){
		if(STATE_RESTAURANT_CUSTOMER_LAUNCH == stateName){
			$state.go(
					stateName, 
					{	companyName: vm.user.company_name	}, 
					{	reload: true	}
					);
			} else if(STATE_RESTAURANT_TABLE_ORDERREFERENCE == stateName){
				$state.go(
						stateName, 
						{
							companyName: vm.user.company_name, 
							branchName: vm.user.branch_name
							}, 
							{	reload: true	}
							);
				}
		}
	
	$scope.$watch(
			function(){	return vm.company;
			}, 
			function(){
				if(!(null == vm.company)){	vm._company = vm._company = vm.company[vm.companyName];
				}
				}
			);
	}