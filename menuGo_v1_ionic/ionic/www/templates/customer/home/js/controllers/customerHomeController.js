angular
.module('starter')
.controller('customerHomeController', customerHomeController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerHomeController.$inject = [
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerHomeController(		
){
	/* ******************************
	 * Controller Implementation (Start)
	 * ****************************** */
	var vm = this;
	vm.restaurantAds = undefined;
	/* ******************************
	 * Controller Implementation (End)
	 * ****************************** */
	
	/*
	 * test-data (Start)
	 * */
	vm.restaurantAds = {
			Ad_1: 'This is Advertisement 1', 
			Ad_2: 'This is Advertisement 2', 
			Ad_3: 'This is Advertisement 3'
	}
	/*
	 * test-data (End)
	 * */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */