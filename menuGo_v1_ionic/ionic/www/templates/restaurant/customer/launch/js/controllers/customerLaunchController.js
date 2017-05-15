angular
.module('starter')
.controller(
		'customerLaunchController', 
		customerLaunchController
		);

customerLaunchController.$inject = [
                                    'KEYS', 
                                    '$scope', 
                                    '$state', 
                                    '$stateParams'
                                    ];

function customerLaunchController(
		KEYS, 
		$scope, 
		$state, 
		$stateParams
		){
	const STATE_RESTAURANT_CUSTOMER_QR = 'restaurant.customer-qr';
	
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
		if(STATE_RESTAURANT_CUSTOMER_QR == stateName){
			$state.go(
					STATE_RESTAURANT_CUSTOMER_QR, 
					{	companyName: vm.user.company_name	}, 
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