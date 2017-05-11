angular
.module('starter')
.controller(
		'customerLaunchController', 
		customerLaunchController
		);

customerLaunchController.$inject = [
                                    '$state'
                                    ];

function customerLaunchController(
		$state
		){
	const STATE_CUSTOMER_QR = 'restaurant.customer-qr';
	
	var vm = this;
	
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
			function(){	return localStorage.getItem(KEYS.User);
			}, 
			function(){
				vm.user = localStorage.getItem(KEYS.User);
				vm.user = JSON.parse(vm.user);
				}
			);
	}