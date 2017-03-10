angular
.module('starter')
.factory('marketingService', marketingService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
marketingService.$inject = [
	'API_BASE_URL', 
	'$localStorage'
]
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function marketingService(
		API_BASE_URL, 
		$localStorage
){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var marketingServiceObj = {
			restaurantAds: {}, 
			foodBlogs: {}, 
			restaurantAdId: undefined, 
			foodBlogId: undefined, 
			companyName: undefined, 
			getRestaurantAds: getRestaurantAds, 
			getFoodBlogs: getFoodBlogs, 
			getRestaurantAdId: getRestaurantAdId, 
			getFoodBlogId: getFoodBlogId, 
			getCompanyName: getCompanyName, 
			setRestaurantAds: setRestaurantAds, 
			setFoodBlogs: setFoodBlogs, 
			setRestaurantAdId: setRestaurantAdId, 
			setFoodBlogId: setFoodBlogId, 
			setCompanyName: setCompanyName, 
			fetchRestaurantAds: fetchRestaurantAds, 
			fetchRestaurantAd: fetchRestaurantAd, 
			addRestaurantAd: addRestaurantAd, 
			updateRestaurantAd: updateRestaurantAd, 
			deleteRestaurantAd: deleteRestaurantAd, 
			fetchFoodBlogs: fetchFoodBlogs, 
			fetchFoodBlog: fetchFoodBlog, 
			addFoodBlog: addFoodBlog, 
			updateFoodBlog: updateFoodBlog, 
			deleteFoodBlog: deleteFoodBlog
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getRestaurantAds(){
		return marketingServiceObj.restaurantAds;
	}
	
	function getFoodBlogs(){
		return marketingServiceObj.foodBlogs;
	}
	
	function getRestaurantAdId(){
		return marketingServiceObj.restaurantAdId;
	}
	
	function getFoodBlogId(){
		return marketingServiceObj.foodBlogId;
	}
	
	function getCompanyName(){
		return marketingServiceObj.companyName;
	}
	
	function setRestaurantAds(restaurantAds){
		marketingServiceObj.restaurantAds = restaurantAds;
	}
	
	function setFoodBlogs(foodBlogs){
		marketingServiceObj.foodBlogs = foodBlogs;
	}
	
	function setRestaurantAdId(restaurantAdId){
		marketingServiceObj.restaurantAdId = restaurantAdId;
	}
	
	function setFoodBlogId(foodBlogId){
		marketingServiceObj.foodBlogId = foodBlogId;
	}
	
	function setCompanyName(companyName){
		marketingServiceObj.companyName = companyName;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchRestaurantAds()
	 * purpose: fetch restaurant ads from server
	 * ****************************** */
	function fetchRestaurantAds(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/ads/'
		}
		$httpConfig(httpConfig)
		.then(fetchRestaurantAdsSuccessCallback)
		.catch(fetchRestaurantAdsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchRestaurantAdsSuccessCallback(response){
			//do something on success
		}
		
		function fetchRestaurantAdsFailedCallback(responseError){
			//do something on failure
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertRestaurantAdsResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertRestaurantAdsResponseToMap(responseData){
			
		}
	}
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */