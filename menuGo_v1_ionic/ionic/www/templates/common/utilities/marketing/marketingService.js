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
			advertisements: {}, 
			advertisement: {}, 
			blogs: {}, 
			blog: {}, 
			advertisementId: undefined, 
			blogId: undefined, 
			companyName: undefined, 
			getAdvertisements: getAdvertisements, 
			getAdvertisement: getAdvertisement, 
			getBlogs: getBlogs, 
			getBlog: getBlog, 
			getAdvertisementId: getAdvertisementId, 
			getBlogId: getBlogId, 
			getCompanyName: getCompanyName, 
			setAdvertisements: setAdvertisements, 
			setAdvertisement: setAdvertisement, 
			setBlogs: setBlogs, 
			setBlog: setBlog, 
			setAdvertisementId: setAdvertisementId, 
			setBlogId: setBlogId, 
			setCompanyName: setCompanyName, 
			fetchAdvertisements: fetchAdvertisements, 
			fetchAdvertisement: fetchAdvertisement, 
			addAdvertisement: addAdvertisement, 
			updateAdvertisement: updateAdvertisement, 
			deleteAdvertisement: deleteAdvertisement, 
			fetchBlogs: fetchBlogs, 
			fetchBlog: fetchBlog, 
			addBlog: addBlog, 
			updateBlog: updateBlog, 
			deleteBlog: deleteBlog
	}
	/* ******************************
	 * Service Return Object (End)
	 * ****************************** */
	
	/* ******************************
	 * Accessors: Getters & Setters (Start)
	 * ****************************** */
	function getAdvertisements(){
		return marketingServiceObj.advertisements;
	}
	
	function getAdvertisement(){
		return marketingServiceObj.advertisement;
	}
	
	function getBlogs(){
		return marketingServiceObj.blogs;
	}
	
	function getBlog(){
		return marketingServiceObj.blog;
	}
	
	function getAdvertisementId(){
		return marketingServiceObj.advertisementId;
	}
	
	function getBlogId(){
		return marketingServiceObj.blogId;
	}
	
	function getCompanyName(){
		return marketingServiceObj.companyName;
	}
	
	function setAdvertisements(advertisements){
		marketingServiceObj.advertisements = advertisements;
	}
	
	function setAdvertisement(advertisement){
		marketingServiceObj.advertisement = advertisement;
	}
	
	function setBlogs(blogs){
		marketingServiceObj.blogs = blogs;
	}
	
	function setBlog(blog){
		marketingServiceObj.blog = blog;
	}
	
	function setAdvertisementId(advertisementId){
		marketingServiceObj.advertisementId = advertisementId;
	}
	
	function setBlogId(blogId){
		marketingServiceObj.blogId = blogId;
	}
	
	function setCompanyName(companyName){
		marketingServiceObj.companyName = companyName;
	}
	/* ******************************
	 * Accessors: Getters & Setters (End)
	 * ****************************** */
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchAdvertisements()
	 * purpose: fetch advertisements from server
	 * ****************************** */
	function fetchAdvertisements(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/advertisements'
		}
		$http(httpConfig)
		.then(fetchAdvertisementsSuccessCallback)
		.catch(fetchAdvertisementsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchAdvertisementsSuccessCallback(response){
			marketingServiceObj.advertisements = {};
			convertAdvertisementsResponseToMap(response.data);
			var advertisements = marketingServiceObj.advertisements;
			advertisements = JSON.stringify(advertisements);
			localStorage.setItem('Advertisements', advertisements);
			deferred.resolve(response);
		}
		
		function fetchAdvertisementsFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertAdvertisementsResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertAdvertisementsResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var advertisementsKey = ADVERTISEMENTS_DB_FIELDS[0] //advertisement_id
			var advertisementsDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var advertisementsRunner = responseData[i];
				var advertisementsDBFieldCount = Object.keys(ADVERTISEMENTS_DB_FIELDS).length;
				var advertisementsDBFieldRunner = null;
				advertisementsDetails = {};
				
				for(var j=0; j<advertisementsDBFieldCount; j++){
					advertisementsDBFieldRunner = ADVERTISEMENTS_DB_FIELDS[j];
					advertisementsDetails[advertisementsDBFieldRunner] = advertisementsRunner[advertisementsDBFieldRunner];
				}
				var advertisementsKeyValue = advertisementsRunner[advertisementsKey];
				marketingServiceObj.advertisements[advertisementsKeyValue] = advertisementsDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchAdvertisement()
	 * purpose: fetch advertisement from server
	 * ****************************** */
	function fetchAdvertisement(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/advertisements/' + marketingServiceObj.advertisementId
		}
		$http(httpConfig)
		.then(fetchAdvertisementSuccessCallback)
		.catch(fetchAdvertisementFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchAdvertisementSuccessCallback(response){
			marketingServiceObj.advertisement = {};
			convertAdvertisementResponseToMap(response.data);
			var advertisement = marketingServiceObj.advertisement;
			advertisement = JSON.stringify(advertisement);
			localStorage.setItem('Advertisement', advertisement);
			deferred.resolve(response);
		}
		
		function fetchAdvertisementFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertAdvertisementResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertAdvertisementResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var advertisementKey = ADVERTISEMENTS_DB_FIELDS[0]; //advertisement_id
			var advertisementDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var advertisementRunner = responseData[i];
				var advertisementFieldCount = Object.keys(ADVERTISEMENTS_DB_FIELDS).length;
				var advertisementFieldRunner = null;
				var advertisementDetails = {};
				
				for(var j=0; j<advertisementDBFieldCount; j++){
					advertisementDBFieldRunner = ADVERTISEMENTS_DB_FIELDS[j];
					advertisementDetails[advertisementDBFieldRunner] = advertisementRunner[advertisementDBFieldRunner];
				}
				var advertisementKeyValue = advertisementRunner[advertisementKey];
				marketingServiceObj.advertisement[advertisementKeyValue] = advertisementDetails;
			}
		}
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addAdvertisement()
	 * purpose: adds advertisement
	 * ****************************** */
	function addAdvertisement(advertisements){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/advertisements', 
				data: advertisements
		}
		$http(httpConfig)
		.then(addAdvertisementSuccessCallback)
		.catch(addAdvertisementFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addAdvertisementSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addAdvertisementFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateAdvertisement()
	 * purpose: updates advertisement
	 * ****************************** */
	function updateAdvertisement(advertisement){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/advertisements/' + marketingServiceObj.advertisementId, 
				data: advertisement
		}
		$http(httpConfig)
		.then(updateAdvertisementSuccessCallback)
		.catch(updateAdvertisementFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateAdvertisementSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateAdvertisementFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteAdvertisement()
	 * purpose: deletes advertisement
	 * ****************************** */
	function deleteAdvertisement(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/advertisements/' + marketingServiceObj.advertisementId
		}
		$http(httpConfig)
		.then(deleteAdvertisementSuccessCallback)
		.catch(deleteAdvertisementFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteAdvertisementSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteAdvertisementFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchBlogs()
	 * purpose: fetch blogs from server
	 * ****************************** */
	function fetchBlogs(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/blogs'
		}
		$http(httpConfig)
		.then(fetchBlogsSuccessCallback)
		.catch(fetchBlogsFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBlogsSuccessCallback(response){
			marketingServiceObj.blogs = {};
			convertBlogsResponseToMap(response.data);
			var blogs  = marketingServiceObj.blogs;
			blogs = JSON.stringify(blogs);
			localStorage.setItem('Blogs', blogs);
			deferred.resolve(response);
		}
		
		function fetchBlogsFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertBlogsResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertBlogsResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var blogsKey = BLOGS_DB_FIELDS[0]; //blog_id
			var blogsDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var blogsRunner = responseData[i];
				var blogsDBFieldCount = Object.keys(BLOGS_DB_FIELDS).length;
				var blogsDBFieldRunner = null;
				blogsDetails = {};
				
				for(var j=0; j<blogsDBFieldCount; j++){
					blogsDBFieldRunner = BLOGS_DB_FIELDS[j];
					blogsDetails[blogsDBFieldRunner] = blogsRunner[blogsDBFieldRunner];
				}
				var blogsKeyValue = blogsRunner[blogsKey];
				marketingServiceObj.blogs[blogsKeyValue] = blogsDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: fetchBlog()
	 * purpose: fetch blog from server
	 * ****************************** */
	function fetchBlog(){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'GET', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.blogId
		}
		$http(httpConfig)
		.then(fetchBlogSuccessCallback)
		.catch(fetchBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function fetchBlogSuccessCallback(response){
			marketingServiceObj.blog = {};
			convertBlogResponseToMap(response.data);
			var blog = marketingServiceObj.blog;
			blog = JSON.stringify(blog);
			localStorage.setItem('Blog', blog);
			deferred.resolve(response);
		}
		
		function fetchBlogFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		
		/* ******************************
		 * Method Implementation
		 * method name: convertBlogResponseToMap()
		 * purpose: convert http response to a map
		 * ****************************** */
		function convertBlogResponseToMap(responseData){
			var responseDataLength = responseData.length;
			var blogKey = BLOGS_DB_FIELDS[0]; //blog_id
			var blogDetails;
			
			for(var i=0; i<responseDataLength; i++){
				var blogRunner = responseData[i];
				var blogDBFieldCount = Object.keys(BLOGS_DB_FIELDS).length;
				var blogDBFieldRunner = null;
				blogDetails = {};
				
				for(var j=0; j<blogDBFieldCount; j++){
					blogDBFieldRunner = BLOGS_DB_FIELDS[j];
					blogDetails[blogDBFieldRunner] = blogRunner[blogDBFieldRunner];
				}
				var blogKeyValue = blogRunner[blogKey];
				marketingServiceObj.blog[blogKeyValue] = blogDetails;
			}
		}
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: addBlog()
	 * purpose: adds blog
	 * ****************************** */
	function addBlog(blogs){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'POST', 
				url: API_BASE_URL + '/blogs', 
				data: blogs
		}
		$http(httpConfig)
		.then(addBlogSuccessCallback)
		.catch(addBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function addBlogSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function addBlogFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: updateBlog()
	 * purpose: updates blog
	 * ****************************** */
	function updateBlog(blog){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'PUT', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.blogId, 
				data: blog
		}
		$http(httpConfig)
		.then(updateBlogSuccessCallback)
		.catch(updateBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function updateBlogSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function updateBlogFailedCallback(responseError){
			deferred.reject(responseError);
		}
		/* ******************************
		 * Callback Implementations (End)
		 * ****************************** */
		return deferred.promise;
	}
	
	/* ******************************
	 * Method Implementation
	 * method name: deleteBlog()
	 * purpose: deletes blog
	 * ****************************** */
	function deleteBlog(blog){
		var deferred = $q.defer();
		var httpConfig = {
				method: 'DELETE', 
				url: API_BASE_URL + '/blogs/' + marketingServiceObj.blogId
		}
		$http(httpConfig)
		.then(deleteBlogSuccessCallback)
		.catch(deleteBlogFailedCallback);
		
		/* ******************************
		 * Callback Implementations (Start)
		 * ****************************** */
		function deleteBlogSuccessCallback(response){
			deferred.resolve(response);
		}
		
		function deleteBlogFailedCallback(responseError){
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