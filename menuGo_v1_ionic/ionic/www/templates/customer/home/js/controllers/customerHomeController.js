angular
.module('starter')
.controller('customerHomeController', customerHomeController);

/* ******************************
 * Controller Dependency Injection (Start)
 * ****************************** */
customerHomeController.$inject = [
	'dataService', 
	'$scope'
];
/* ******************************
 * Controller Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Controller Implementation (Start)
 * ****************************** */
function customerHomeController(
		dataService, 
		$scope
){
	const RESTAURANT_ADS_KEY = "Restaurant_Ads";
	const FOOD_BLOGS_KEY = "Food_Blogs";
	/* ******************************
	 * Controller Binded Data (Start)
	 * ****************************** */
	var vm = this;
	if(null == localStorage.getItem(RESTAURANT_ADS_KEY)){
		dataService.fetchRestaurantAds();
	}
	var restaurantAds = localStorage.getItem(RESTAURANT_ADS_KEY);
	restaurantAds = JSON.parse(restaurantAds);
	vm.restaurantAds = restaurantAds;
	if(null == localStorage.getItem(FOOD_BLOGS_KEY)){
		dataService.fetchFoodBlogs();
	}
	var foodBlogs = localStorage.getItem(FOOD_BLOGS_KEY);
	foodBlogs = JSON.parse(foodBlogs);
	vm.foodBlogs = foodBlogs;
	/* ******************************
	 * Controller Binded Data (End)
	 * ****************************** */
	
	/* ******************************
	 * Watchers (Start)
	 * ****************************** */
	$scope.$watch(
			function(){
				return localStorage.getItem(RESTAURANT_ADS_KEY);
			}, 
			function(nVal, oVal){
				var restaurantAds = vm.restaurantAds;
				
				restaurantAds = localStorage.getItem(RESTAURANT_ADS_KEY);
				restaurantAds = JSON.parse(restaurantAds);
				
				vm.restaurantAds = restaurantAds;
			}
	);
	
	$scope.$watch(
			function(){
				return localStorage.getItem(FOOD_BLOGS_KEY);
			}, 
			function(nVal, oVal){
				var foodBlogs = vm.foodBlogs;
				
				foodBlogs = localStorage.getItem(FOOD_BLOGS_KEY);
				foodBlogs = JSON.parse(foodBlogs);
				
				vm.foodBlogs = foodBlogs;
			}
	);
	/* ******************************
	 * Watchers (End)
	 * ****************************** */
}
/* ******************************
 * Controller Implementation (End)
 * ****************************** */