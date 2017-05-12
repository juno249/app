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
	const STATE_CUSTOMER_QR = 'restaurant.customer-qr';
	
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	
	//controller_method
	vm.gotoState = gotoState;
	
	function gotoState(
			stateName, 
			stateParams
			){
		if(STATE_CUSTOMER_QR == stateName){
			$state.go(
					STATE_CUSTOMER_QR, 
					{	companyName: vm.user.companyName	}, 
					{	reload: true	}
					);
			}
		}
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.Companies);
			}, 
			function(){
				vm.company = localStorage.getItem(KEYS.Companies);
				vm.company = JSON.parse(vm.company);
				}
			);
	
	$scope.$watch(
			function(){	return vm.company;
			}, 
			function(){
				if(!(null == vm.company)){	vm._company = vm._company = vm.company[vm.companyName];
				}
				}
			);
	
	$scope.$watch(
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
				vm.user = JSON.parse(vm.user);
				}
			);
	}