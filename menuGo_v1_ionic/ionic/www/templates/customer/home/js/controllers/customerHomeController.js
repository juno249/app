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
	vm.foodBlogs = undefined;
	/* ******************************
	 * Controller Implementation (End)
	 * ****************************** */
	
	/* ******************************
	 * test-data (Start)
	 * ****************************** */
	vm.restaurantAds = [
		{
			companyName: 'Jollibee', 
			adContent: 'Jollibee Chicken Joy', 
			price: 97
		}, {
			companyName: "Max's", 
			adContent: "Max's Fried Chicken", 
			price: 565
		}, {
			companyName: 'McDonalds', 
			adContent: 'McDonalds Fried Chicken', 
			price: 79
		}
	]
	vm.foodBlogs = [
		{
			title: 'title # 1', 
			content: 'content # 1'
		}, {
			title: 'title # 2', 
			content: 'content # 2'
		}
	]
	/* ******************************
	 * test-data (End)
	 * ****************************** */
	
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */