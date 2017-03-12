angular
.module('starter')
.factory('marketingService', marketingService);

/* ******************************
 * Service Dependency Injection (Start)
 * ****************************** */
marketingService.$inject = [
	'ADVERTISEMENTS_DB_FIELDS', 
	'API_BASE_URL', 
	'BLOGS_DB_FIELDS', 
	'$http', 
	'$localStorage', 
	'$q'
]
/* ******************************
 * Service Dependency Injection (End)
 * ****************************** */

/* ******************************
 * Service Implementation (Start)
 * ****************************** */
function marketingService(
		ADVERTISEMENTS_DB_FIELDS, 
		API_BASE_URL, 
		BLOGS_DB_FIELDS, 
		$http, 
		$localStorage, 
		$q
){
	/* ******************************
	 * Service Return Object (Start)
	 * ****************************** */
	var marketingServiceObj = {
			restaurantAds: {}, 
			restaurantAd: {}, 
			foodBlogs: {}, 
			foodBlog: {}, 
			restaurantAdId: undefined, 
			foodBlogId: undefined, 
			companyName: undefined, 
			getRestaurantAds: getRestaurantAds, 
			getRestaurantAd: getRestaurantAd, 
			getFoodBlogs: getFoodBlogs, 
			getFoodBlog: getFoodBlog, 
			getRestaurantAdId: getRestaurantAdId, 
			getFoodBlogId: getFoodBlogId, 
			getCompanyName: getCompanyName, 
			setRestaurantAds: setRestaurantAds, 
			setRestaurantAd: setRestaurantAd, 
			setFoodBlogs: setFoodBlogs, 
			setFoodBlog: setFoodBlog, 
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
	
	function getRestaurantAd(){
		return marketingServiceObj.restaurantAd;
	}
	
	function getFoodBlogs(){
		return marketingServiceObj.foodBlogs;
	}
	
	function getFoodBlog(){
		return marketingServiceObj.foodBlog;
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
	
	function setRestaurantAd(restaurantAd){
		marketingServiceObj.restaurantAd = restaurantAd;
	}
	
	function setFoodBlogs(foodBlogs){
		marketingServiceObj.foodBlogs = foodBlogs;
	}
	
	function setFoodBlog(foodBlog){
		marketingServiceObj.foodBlog = foodBlog;
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
		$http(httpConfig)
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
			var restaurantAdsKey = ADVERTISEMENTS_DB_FIELDS[0] //advertisement_id
			var restaurantAdsDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var restaurantAdsRunner = responseData[i];
				var restaurantAdsDBFieldCount = Object.keys(ADVERTISEMENTS_DB_FIELDS).length;
				var restaurantAdsDBFieldRunner = null;
				restaurantAdsDetails = {};
				
				for(var j=0; j<restaurantAdsDBFieldCount; j++){
					restaurantAdsDBFieldRunner = ADVERTISEMENTS_DB_FIELDS[j];
					restaurantAdsDetails[restaurantAdsDBFieldRunner] = restaurantAdsRunner[restaurantAdsDBFieldRunner];
				}
				var restaurantAdsKeyValue = restaurantAdsRunner[restaurantAdsKey];
				marketingServiceObj.restaurantAds[restaurantAdsKeyValue] = restaurantAdsDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchRestaurantAd()
	 * purpose: fetch restaurant ad from server
	 * ****************************** */
	function fetchRestaurantAd(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/ads/' + marketingServiceObj.restaurantAdId
		}
		$http(httpConfig)
		.then(fetchRestaurantAdSuccessCallback)
		.catch(fetchRestaurantAdFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchRestaurantAdSuccessCallback(response){
			marketingServiceObj.restaurantAd = {};
			convertRestaurantAdResponseToMap(response.data);
			var restaurantAd = marketingServiceObj.restaurantAd;
			restaurantAd = JSON.stringify(restaurantAd);
			localStorage.setItem('Restaurant_Ad', restaurantAd);
			deferred.resolve(response);
		}
		
		function fetchRestaurantAdFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertRestaurantAdResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertRestaurantAdResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var restaurantAdKey = ADVERTISEMENTS_DB_FIELDS[0]; //advertisement_id
			var restaurantAdDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var restaurantAdRunner = responseData[i];
				var restaurantAdDBFieldCount = Object.keys(ADVERTISEMENTS_DB_FIELDS).length;
				var restaurantAdDBFieldRunner = null;
				var restaurantAdDetails = {};
				
				for(var j=0; j<restaurantAdDBFieldCount; j++){
					restaurantAdDBFieldRunner = ADVERTISEMENTS_DB_FIELDS[j];
					restaurantAdDetails[restaurantAdDBFieldRunner] = restaurantAdRunner[restaurantAdDBFieldRunner];
				}
				var restaurantAdKeyValue = restaurantAdRunner[restaurantAdKey];
				marketingServiceObj.restaurantAd[restaurantAdKeyValue] = restaurantAdDetails;
			}
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addRestaurantAd()
	 * purpose: adds restaurantAd
	 * ****************************** */
	function addRestaurantAd(restaurnatAd){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/ads', 
				data: restaurantAd
		}
		$http(httpConfig)
		.then(addRestaurantAdSuccessCallback)
		.catch(addRestaurantAdFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addRestaurantAdSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addRestaurantAdFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateRestaurantAd()
	 * purpose: updates restaurantAd
	 * ****************************** */
	function updateRestaurantAd(restaurantAd){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/ads/' + marketingServiceObj.restaurantAdId, 
				data: restaurantAd
		}
		$http(httpConfig)
		.then(updateRestaurantAdSuccessCallback)
		.catch(updateRestaurantAdFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateRestaurantAdSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateRestaurantAdFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteRestaurantAd()
	 * purpose: deletes restaurantAd
	 * ****************************** */
	function deleteRestaurantAd(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/ads/' + marketingServiceObj.restaurantAdId
		}
		$http(httpConfig)
		.then(deleteRestaurantAdSuccessCallback)
		.catch(deleteRestaurantAdFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteRestaurantAdSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteRestaurantAdFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchFoodBlogs()
	 * purpose: fetch food blogs from server
	 * ****************************** */
	function fetchFoodBlogs(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/blogs'
		}
		$http(httpConfig)
		.then(fetchFoodBlogsSuccessCallback)
		.catch(fetchFoodBlogsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchFoodBlogsSuccessCallback(response){
			marketingServiceObj.foodBlogs = {};
			convertFoodBlogsResponseToMap(response.data);
			var foodBlogs  = marketingServiceObj.foodBlogs;
			foodBlogs = JSON.stringify(foodBlogs);
			localStorage.setItem('Food_Blogs', foodBlogs);
			deferred.resolve(response);
		}
		
		function fetchFoodBlogsFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertFoodBlogsResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertFoodBlogsResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var foodBlogsKey = BLOGS_DB_FIELDS[0]; //blog_id
			var foodBlogsDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var foodBlogsRunner = responseData[i];
				var foodBlogsDBFieldCount = Object.keys(BLOGS_DB_FIELDS).length;
				var foodBlogsDBFieldRunner = null;
				foodBlogsDetails = {};
				
				for(var j=0; j<foodBlogsDBFieldCount; j++){
					foodBlogsDBFieldRunner = BLOGS_DB_FIELDS[j];
					foodBlogsDetails[foodBlogsDBFieldRunner] = foodBlogsRunner[foodBlogsDBFieldRunner];
				}
				var foodBlogsKeyValue = foodBlogsRunner[foodBlogsKey];
				marketingServiceObj.foodBlogs[foodBlogsKeyValue] = foodBlogsDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchFoodBlog()
	 * purpose: fetch food blog from server
	 * ****************************** */
	function fetchFoodBlog(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.foodBlogId
		}
		$http(httpConfig)
		.then(fetchFoodBlogSuccessCallback)
		.catch(fetchFoodBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchFoodBlogSuccessCallback(response){
			marketingServiceObj.foodBlog = {};
			convertFoodBlogResponseToMap(response.data);
			var foodBlog = marketingServiceObj.foodBlog;
			foodBlog = JSON.stringify(foodBlog);
			localStorage.setItem('Food_Blog', foodBlog);
			deferred.resolve(response);
		}
		
		function fetchFoodBlogFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertFoodBlogResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertFoodBlogResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var foodBlogKey = BLOGS_DB_FIELDS[0]; //blog_id
			var foodBlogDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var foodBlogRunner = responseData[i];
				var foodBlogDBFieldCount = Object.keys(BLOGS_DB_FIELDS).length;
				var foodBlogDBFieldRunner = null;
				foodBlogDetails = {};
				
				for(var j=0; j<foodBlogDBFieldCount; j++){
					foodBlogDBFieldRunner = BLOGS_DB_FIELDS[j];
					foodBlogDetails[foodBlogDBFieldRunner] = foodBlogRunner[foodBlogDBFieldRunner];
				}
				var foodBlogKeyValue = foodBlogRunner[foodBlogKey];
				marketingServiceObj.foodBlog[foodBlogKeyValue] = foodBlogDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addFoodBlog()
	 * purpose: adds food blog
	 * ****************************** */
	function addFoodBlog(foodBlog){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/blogs', 
				data: foodBlog
		}
		$http(httpConfig)
		.then(addFoodBlogSuccessCallback)
		.catch(addFoodBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addFoodBlogSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addFoodBlogFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateFoodBlog()
	 * purpose: updates food blog
	 * ****************************** */
	function updateFoodBlog(foodBlog){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.foodBlogId, 
				data: foodBlog
		}
		$http(httpConfig)
		.then(updateFoodBlogSuccessCallback)
		.catch(updateFoodBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateFoodBlogSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateFoodBlogFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteFoodBlog()
	 * purpose: deletes food blog
	 * ****************************** */
	function deleteFoodBlog(foodBlog){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.foodBlogId
		}
		$http(httpConfig)
		.then(deleteFoodBlogSuccessCallback)
		.catch(deleteFoodBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteFoodBlogSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteFoodBlogFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	return marketingServiceObj;
}
/* ******************************
 * Service Implementation (End)
 * ****************************** */