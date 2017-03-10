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
				url: API_BASE_URL + '/ads'
		}
		$httpConfig(httpConfig)
		.then(fetchRestaurantAdsSuccessCallback)
		.catch(fetchRestaurantAdsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchRestaurantAdsSuccessCallback(response){
			marketingServiceObj.restaurantAds = {};
			convertRestaurantAdsResponseToMap(response.data);
			var restaurantAds = marketingServiceObj.restaurantAds;
			restaurantAds = JSON.stringify(restaurantAds);
			localStorage.setItem('Restaurant_Ads', restaurantAds);
			deferred.resolve(response);
		}
		
		function fetchRestaurantAdsFailedCallback(responseError){
			deferred.reject(responseError);
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
			var responseDataLength = responseData.length;
			var restaurantAdsKey = ADVERTISEMENTS_DB_FIELDS[0] //ad_id
			var restaurantAdsDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var restaurantAdsRunner = responseData[i];
				var restaurantAdsDBFieldCount = Object.keys(ADVERTISEMENTS_DB_FIELDS);
				var restaurantAdsDBFieldRunner = null;
				restaurantAdsDetails = {};
				
				for(var j=0; j<restaurantAdsDBFieldCount; j++){
					restaurantAdsDBFieldRunner = ADVERTISEMENTS_DB_FIELDS[j];
					restaurantAdsDetails[restaurantAdsDBFieldRunner] = restaurantAdsRunner[restaurantAdsDBFieldRunner];
				}
				var restaurantAdsKeyValue = restaurantAdsRunner[restaurantAdsKey];
				marketingServiceObj.restaurantAds[restaurantAdsKey] = restaurantAdsDetails;
			}
		}
		return deferred.promise;
	}
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */