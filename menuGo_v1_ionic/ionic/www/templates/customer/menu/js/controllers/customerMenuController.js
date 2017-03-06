angular
.module('starter')
.controller('customerMenuController', customerMenuController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerMenuController.$inject = [
	'$stateParams'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerMenuController(
		$stateParams
){
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */