angular
.module('starter')
.controller(
		'tableOrderreferenceController', 
		tableOrderreferenceController
		);

tableOrderreferenceController.$inject = [
                                         '$stateParams'
                                         ];

function tableOrderreferenceController(
		$stateParams
		){
	var vm = this;
	
	if(!(null == $stateParams.companyName)){	vm.companyName = $stateParams.companyName;
	}
	if(!(null == $stateParams.branchName)){	vm.branchName = $stateParams.branchName;
	}
	}