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